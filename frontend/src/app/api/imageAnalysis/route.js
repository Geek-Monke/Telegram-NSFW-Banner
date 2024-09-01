import nextConnect from 'next-connect';  // Correct import (fixed without curly braces)
import multer from 'multer';  // Import multer for file handling
import { ImageAnnotatorClient } from '@google-cloud/vision';  // Import Google Vision client
import path from 'path';  // Import path module for file handling
import fs from 'fs';  // Import fs module for file system handling
import { promisify } from 'util';  // Import promisify to handle asynchronous operations with fs

const unlinkAsync = promisify(fs.unlink);  // Convert fs.unlink to a promise-based function

const upload = multer({ dest: 'uploads/' });  // Configure multer to use 'uploads/' directory for temporary storage
const client = new ImageAnnotatorClient();  // Initialize the Google Cloud Vision client

export const config = {
    api: {
        bodyParser: false,  // Disable body parser to handle file uploads
    },
};

// Initialize next-connect handler
const handler = nextConnect({
    onError(error, req, res) {
        console.error('Error:', error);  // Log detailed error to server console
        res.status(501).json({ error: `Something went wrong! ${error.message}` });  // Return a 501 error with a message
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' not allowed` });  // Return a 405 error for unsupported methods
    },
});

// Use middleware for handling multipart form data
handler.use(upload.single('screenshot'));  // Adjust 'screenshot' to match the field name from the client

// Define a POST route for image analysis
handler.post(async (req, res) => {
    try {
        // Get the file path of the uploaded image
        const filePath = path.join(process.cwd(), req.file.path);

        // Perform text detection using Google Cloud Vision
        const [result] = await client.textDetection(filePath);
        const detections = result.textAnnotations;

        // Extract detected text and convert it to lowercase
        const detectedText = detections.map((text) => text.description).join(' ').toLowerCase();

        // Define keywords or phrases to verify the report
        const reportKeywords = ['reported', 'this is spam', 'report'];
        const groupName = 'your_group_name'.toLowerCase();  // Replace with the actual group name

        // Check if the detected text contains both report confirmation and the group name
        const reportConfirmed = reportKeywords.some((keyword) => detectedText.includes(keyword)) || detectedText.includes(groupName);

        // Remove the uploaded file after processing
        await unlinkAsync(filePath);

        // Respond with appropriate message based on verification result
        if (reportConfirmed) {
            res.status(200).json({ message: 'Thank you! Your report has been verified.' });
        } else {
            res.status(400).json({
                message: 'Verification failed. Please try again or ensure the screenshot is clear.',
            });
        }
    } catch (error) {
        console.error('Processing Error:', error);  // Log the error
        res.status(500).json({ message: 'An error occurred while processing the screenshot.' });
    }
});

export default handler;  // Export the handler as default
