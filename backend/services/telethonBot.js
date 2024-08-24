const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const apiId = parseInt(process.env.TELEGRAM_API_ID, 10);

const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(''); // fill this later with your saved session

async function fetchChannelMessages(link) {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: process.env.PHONE_NUMBER,
        password: async () => await input.text('Password?'),
        phoneCode: async () => await input.text('Code?'),
        onError: (err) => console.log(err),
    });

    const result = await client.getEntity(link);
    const messages = await client.getMessages(result, { limit: 10 });

    // Save messages, images, and links to respective folders
    // This will be handled in the `fileHandler` service
    return messages;
}

module.exports = { fetchChannelMessages };
