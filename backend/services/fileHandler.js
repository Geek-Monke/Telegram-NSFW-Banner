const fs = require('fs');
const path = require('path');

async function saveMessages(messages, client) {
    console.log("Processing messages...");
    console.log(messages);

    const tmeLinksSet = new Set();
    const texts = messages
        .filter(msg => msg.message)
        .map(msg => {
            let text = msg.message;

            const links = text.match(/https:\/\/t\.me[^\s]*/g);
            if (links) {
                links.forEach(link => tmeLinksSet.add(link));
            }

            text = text.replace(/https:\/\/[^\s]+/g, '');

            return text.replace(/\s+/g, '');
        });

    const tmeLinks = Array.from(tmeLinksSet);
    console.log("Extracted t.me Links:", tmeLinks);
    console.log("Cleaned Texts (without links and spaces):", texts);

    const dataFolder = path.join(__dirname, '../data');
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    const textFilePath = path.join(dataFolder, 'text.txt');
    fs.writeFileSync(textFilePath, texts.join(''), 'utf8');
    console.log('Cleaned messages saved to text.txt successfully!');

    const linksFilePath = path.join(dataFolder, 'links.txt');
    fs.writeFileSync(linksFilePath, tmeLinks.join('\n'), 'utf8');
    console.log('Extracted t.me links saved to links.txt successfully!');

    const images = messages
        .filter(msg => msg.media && msg.media.className === 'MessageMediaPhoto')
        .map(msg => ({
            id: msg.id,
            media: msg.media
        }));

    const imagesFolder = path.join(dataFolder, 'images');
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder, { recursive: true });
    }

    for (let img of images) {
        try {
            const imageFilePath = path.join(imagesFolder, `image_${img.id}.jpg`);

            // Use the client's downloadMedia method to download the image
            const imageBuffer = await client.downloadMedia(img.media, {});

            fs.writeFileSync(imageFilePath, imageBuffer);
            console.log(`Image saved as image_${img.id}.jpg`);
        } catch (error) {
            console.log(`Failed to save image ${img.id}:`, error);
        }
    }

    console.log('All images processed!');
}

module.exports = { saveMessages };
