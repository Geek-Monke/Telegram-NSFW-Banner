const fs = require('fs');
const path = require('path');

function saveMessages(messages) {
    console.log("Processing messages...");

    // Extract texts from messages
    const texts = messages
        .filter(msg => msg.message) // Filter out messages without text
        .map(msg => msg.message);   // Extract the text from each message

    console.log("Extracted Texts:", texts);

    // Extract images from messages
    const images = messages
        .filter(msg => msg.media)   // Filter out messages without media
        .map(msg => ({
            id: msg.id,             // Store the message ID
            media: msg.media        // Store the media object
        }));

    console.log("Extracted Images:", images);

    // Extract links from text messages
    const links = texts.filter(text => text.includes('https://t.me'));

    console.log("Extracted Links:", links);

    // Define file paths
    const textsPath = path.join(__dirname, '../data/texts.json');
    const linksPath = path.join(__dirname, '../data/links.json');
    const imagesPath = path.join(__dirname, '../data/images.json');

    // Save texts, links, and images to JSON files
    fs.writeFileSync(textsPath, JSON.stringify(texts, null, 2));
    fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));
    fs.writeFileSync(imagesPath, JSON.stringify(images, null, 2));

    console.log('Messages, links, and images saved successfully!');
}

module.exports = { saveMessages };
