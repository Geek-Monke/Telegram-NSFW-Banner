import multer from 'multer';
import nextConnect from 'next-connect';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });
const client = new ImageAnnotatorClient();

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' not allowed` });
    },
});

apiRoute.use(upload.single('screenshot'));

apiRoute.post(async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), req.file.path);

        // Perform text detection using Google Vision
        const [result] = await client.textDetection(filePath);
        const detections = result.textAnnotations;

        // Extract detected text and convert it to lowercase
        const detectedText = detections.map(text => text.description).join(' ').toLowerCase();

        // Define keywords or phrases to verify the report
        const reportKeywords = ['reported', 'this is spam', 'report'];
        const groupName = 'your_group_name'.toLowerCase(); // Replace with actual group name

        // Check if the detected text contains both report confirmation and the group name
        const reportConfirmed = reportKeywords.some(keyword => detectedText.includes(keyword)) && detectedText.includes(groupName);

        // Remove the uploaded file after processing
        fs.unlinkSync(filePath);

        if (reportConfirmed) {
            res.status(200).json({ message: 'Thank you! Your report has been verified.' });
        } else {
            res.status(200).json({ message: 'Verification failed. Please try again or ensure the screenshot is clear.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while processing the screenshot.' });
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apiRoute;