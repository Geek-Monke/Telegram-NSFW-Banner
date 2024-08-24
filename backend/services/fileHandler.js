const fs = require('fs');
const path = require('path');

function saveMessages(messages) {
    console.log("Processing messages...");

    // Extract links and clean text messages
    const tmeLinks = [];
    const texts = messages
        .filter(msg => msg.message) // Filter out messages without text
        .map(msg => {
            let text = msg.message;

            // Extract t.me links and push them to tmeLinks array
            const links = text.match(/https:\/\/t\.me[^\s]*/g);
            if (links) {
                tmeLinks.push(...links);
            }

            // Remove all links (including t.me) from the text
            text = text.replace(/https:\/\/[^\s]+/g, '');

            // Remove all spaces from the text
            return text.replace(/\s+/g, '');
        });

    console.log("Extracted t.me Links:", tmeLinks);
    console.log("Cleaned Texts (without links and spaces):", texts);

    // Ensure the 'data' folder exists or create it
    const dataFolder = path.join(__dirname, '../data');
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    // Define file path for text.txt
    const textFilePath = path.join(dataFolder, 'text.txt');

    // Save the cleaned texts to text.txt
    fs.writeFileSync(textFilePath, texts.join(''), 'utf8');

    console.log('Cleaned messages saved to text.txt successfully!');

    // Save the extracted t.me links to links.txt
    const linksFilePath = path.join(dataFolder, 'links.txt');
    fs.writeFileSync(linksFilePath, tmeLinks.join('\n'), 'utf8');

    console.log('Extracted t.me links saved to links.txt successfully!');

    // Extract images from messages
    const images = messages
        .filter(msg => msg.media)   // Filter out messages without media
        .map(msg => ({
            id: msg.id,             // Store the message ID
            media: msg.media        // Store the media object (for simplicity assuming a media URL or file buffer)
        }));

    // Ensure the 'images' folder exists inside 'data'
    const imagesFolder = path.join(dataFolder, 'images');
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder, { recursive: true });
    }

    // Save each image in the images folder
    images.forEach((img, index) => {
        const imageFilePath = path.join(imagesFolder, `image_${img.id}.jpg`); // assuming the media is a jpg file
        fs.writeFileSync(imageFilePath, img.media); // Save media (this assumes `img.media` contains the file data)
        console.log(`Image ${index + 1} saved as image_${img.id}.jpg`);
    });

    console.log('All images saved successfully!');
}

module.exports = { saveMessages };
