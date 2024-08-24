const express = require('express');
const router = express.Router();
const { fetchChannelMessages } = require('../services/telethonBot');
const { saveMessages } = require('../services/fileHandler');
const { analyzeText, analyzeImages } = require('../services/analyzeContent');

router.post('/check', async (req, res) => {
    try {
        // const { link } = req.body;

        // const messages = await fetchChannelMessages(link);
        // console.log("Fetched Messages:", messages);

        // saveMessages(messages);

        // Analyze texts and images for explicit content
        const explicitTexts = await analyzeText(texts);
        console.log("Explicit Texts:", explicitTexts);

        // // const explicitImages = await analyzeImages(images);
        // // console.log("Explicit Images:", explicitImages);

        // // Send response based on analysis
        // if (explicitTexts.length > 0) {
        //     res.json({ status: 'explicit', details: { texts: explicitTexts } });
        // } else {
        //     res.json({ status: 'clean' });
        // }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

module.exports = router;
