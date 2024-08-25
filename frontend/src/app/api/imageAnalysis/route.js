import { NextResponse } from 'next/server';
import multer from 'multer';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

const upload = multer({ dest: 'uploads/' });
const client = new ImageAnnotatorClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = nextConnect({
    onError(error, req, res) {
        return NextResponse.json({ error: `Something went wrong! ${error.message}` }, { status: 501 });
    },
    onNoMatch(req) {
        return NextResponse.json({ error: `Method '${req.method}' not allowed` }, { status: 405 });
    },
});

handler.use(upload.single('screenshot'));

handler.post(async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), req.file.path);

        // Perform text detection using Google Vision
        const [result] = await client.textDetection(filePath);
        const detections = result.textAnnotations;

        // Extract detected text and convert it to lowercase
        const detectedText = detections.map((text) => text.description).join(' ').toLowerCase();

        // Define keywords or phrases to verify the report
        const reportKeywords = ['reported', 'this is spam', 'report'];
        const groupName = 'your_group_name'.toLowerCase(); // Replace with actual group name

        // Check if the detected text contains both report confirmation and the group name
        const reportConfirmed =
            reportKeywords.some((keyword) => detectedText.includes(keyword)) || detectedText.includes(groupName);

        // Remove the uploaded file after processing
        await unlinkAsync(filePath);

        if (reportConfirmed) {
            return NextResponse.json({ message: 'Thank you! Your report has been verified.' });
        } else {
            return NextResponse.json({
                message: 'Verification failed. Please try again or ensure the screenshot is clear.',
            });
        }
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred while processing the screenshot.' }, { status: 500 });
    }
});

export const POST = handler;
