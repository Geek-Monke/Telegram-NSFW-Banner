require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const apiId = parseInt(process.env.TELEGRAM_API_ID, 10);
const apiHash = process.env.TELEGRAM_API_HASH;
const sessionString = process.env.TELEGRAM_SESSION || ''; // Retrieve saved session from .env or use empty string

const stringSession = new StringSession(sessionString); // Fill this later with your saved session

async function fetchChannelMessages(link) {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: process.env.PHONE_NUMBER,
        password: async () => await input.text('Password?'),
        phoneCode: async () => await input.text('Code?'),
        onError: (err) => console.log(err),
    });

    // Save the session string after login
    console.log('Your session string:', client.session.save());

    // This session string can now be stored in the .env file for reuse
    const result = await client.getEntity(link);
    const messages = await client.getMessages(result, { limit: 10 });

    // Save messages, images, and links to respective folders
    // This will be handled in the `fileHandler` service
    return messages;
}

module.exports = { fetchChannelMessages };
