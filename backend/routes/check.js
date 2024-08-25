const express = require('express');
const router = express.Router();
const { fetchChannelMessages } = require('../services/telethonBot');
const { saveMessages } = require('../services/fileHandler');
const { analyzeText } = require('../services/analyzeContent');

router.post('/check', async (req, res) => {
    try {
        const { link } = req.body;

        // Fetch group details and messages
        const { groupDetails, messages } = await fetchChannelMessages(link);
        console.log("Fetched Group Details:", groupDetails);
        const lengthOfMessages = messages.length;
        // console.log("Fetched Messages:", messages);

        // Save the messages (if needed)
        saveMessages(messages);
        const flag = await analyzeText();
        // Send the group details and messages to the frontend
        if (flag){
            res.json({ groupDetails, lengthOfMessages });
        }
        else{
            res.json({ message: 'No offensive content detected' });
        }

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

module.exports = router;
