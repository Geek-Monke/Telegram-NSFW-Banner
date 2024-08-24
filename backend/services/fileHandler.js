const fs = require('fs');
const path = require('path');

function saveMessages(messages) {
    console.log("Processing messages...");

    // Extract texts from messages and remove all spaces
    const texts = messages
        .filter(msg => msg.message) // Filter out messages without text
        .map(msg => msg.message.replace(/\s+/g, '')); // Remove all spaces from the text

    console.log("Extracted Texts (without spaces):", texts);

    // Ensure the 'data' folder exists or create it
    const dataFolder = path.join(__dirname, '../data');
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    // Define file path for text.txt
    const textFilePath = path.join(dataFolder, 'text.txt');

    // Save the extracted texts (without spaces) to text.txt
    fs.writeFileSync(textFilePath, texts.join(''), 'utf8');

    console.log('Messages saved to text.txt successfully!');

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




