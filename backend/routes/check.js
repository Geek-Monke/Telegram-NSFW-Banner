const express = require('express');
const router = express.Router();
const { fetchChannelMessages } = require('../services/telethonBot');
const { saveMessages } = require('../services/fileHandler');

router.post('/check', async (req, res) => {
    try {
        const { link } = req.body;

        // Fetch group details and messages
        const { groupDetails, messages } = await fetchChannelMessages(link);
        console.log("Fetched Group Details:", groupDetails);
        // console.log("Fetched Messages:", messages);

        // Save the messages (if needed)
        saveMessages(messages);

        // Send the group details and messages to the frontend
        res.json({ groupDetails, messages });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

module.exports = router;
