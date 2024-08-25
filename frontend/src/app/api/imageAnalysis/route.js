import { ImageAnnotatorClient } from '@google-cloud/vision';
import { NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Initialize the Google Cloud Vision API client
const client = new ImageAnnotatorClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,  // Use the environment variable here
});

const upload = multer({ dest: 'uploads/' });

export const runtime = 'nodejs'; // Replace with 'edge' if you are using Edge functions

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('screenshot');
        const tempFilePath = path.join(process.cwd(), 'uploads', file.name);

        // Save the uploaded file temporarily
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(tempFilePath, buffer);

        // Perform text detection using Google Vision
        const [result] = await client.textDetection(tempFilePath);
        const detections = result.textAnnotations;

        // Extract detected text and convert it to lowercase
        const detectedText = detections.map(text => text.description).join(' ').toLowerCase();

        // Define keywords or phrases to verify the report
        const reportKeywords = ['reported', 'this is spam', 'report'];
        const groupName = 'your_group_name'.toLowerCase(); // Replace with actual group name

        // Check if the detected text contains both report confirmation and the group name
        const reportConfirmed = reportKeywords.some(keyword => detectedText.includes(keyword)) || detectedText.includes(groupName);

        // Remove the uploaded file after processing
        await fs.unlink(tempFilePath);

        if (reportConfirmed) {
            return NextResponse.json({ message: 'Thank you! Your report has been verified.' });
        } else {
            return NextResponse.json({ message: 'Verification failed. Please try again or ensure the screenshot is clear.' });
        }
    } catch (error) {
        return NextResponse.json({ message: `An error occurred while processing the screenshot: ${error.message}` });
    }
}
