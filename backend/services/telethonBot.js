require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const apiId = parseInt(process.env.TELEGRAM_API_ID, 10);
const apiHash = process.env.TELEGRAM_API_HASH;
const sessionString = process.env.TELEGRAM_SESSION || '';

const stringSession = new StringSession(sessionString);

async function fetchChannelMessages(link) {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: process.env.PHONE_NUMBER,
        password: async () => await input.text('Password?'),
        phoneCode: async () => await input.text('Code?'),
        onError: (err) => console.log(err),
    });

    console.log('Your session string:', client.session.save());

    const result = await client.getEntity(link);
    const messages = await client.getMessages(result, { limit: 4 });

    return messages;
}

module.exports = { fetchChannelMessages };
