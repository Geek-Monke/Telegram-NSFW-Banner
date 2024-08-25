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

    // console.log('Your session string:', client.session.save());

    // Fetch the group/channel details
    const groupDetails = await client.getEntity(link);
    const groupName = groupDetails.title;
    const groupLink = link; // Assuming the link provided is the group link

    // Fetch the messages
    const messages = await client.getMessages(groupDetails, { limit: 15 });

    return {
        groupDetails: {
            name: groupName,
            link: groupLink,
            totalMessageCount: groupDetails.participants_count // Total number of participants/messages
        },
        messages
    };
}

module.exports = { fetchChannelMessages };
