const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');

const apiId = 22126642;

const apiHash = "8da73b7cb1bb436a56beaf556140e1c5";
const stringSession = new StringSession(''); // fill this later with your saved session

async function fetchChannelMessages(link) {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: "+917001693312",
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
