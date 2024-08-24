const fs = require('fs');
const path = require('path');

function saveMessages(messages) {
    console.log("Processing messages...");

    const tmeLinksSet = new Set();
    const texts = messages
        .filter(msg => msg.message)
        .map(msg => {
            let text = msg.message;

            // Extract and store links in the set
            const links = text.match(/https:\/\/t\.me[^\s]*/g);
            if (links) {
                links.forEach(link => tmeLinksSet.add(link));
            }

            // Remove links from text
            text = text.replace(/https:\/\/t\.me[^\s]*/g, '');

            // Remove extra spaces
            return text.trim();
        });

    const tmeLinks = Array.from(tmeLinksSet);
    console.log("Extracted t.me Links:", tmeLinks);
    console.log("Cleaned Texts (without links and spaces):", texts);

    const dataFolder = path.join(__dirname, '../data');
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    const textFilePath = path.join(dataFolder, 'text.txt');
    fs.writeFileSync(textFilePath, texts.join('\n'), 'utf8');
    console.log('Cleaned messages saved to text.txt successfully!');

    const linksFilePath = path.join(dataFolder, 'links.txt');
    fs.writeFileSync(linksFilePath, tmeLinks.join('\n'), 'utf8');
    console.log('Extracted t.me links saved to links.txt successfully!');

    console.log('All messages processed!');
}

module.exports = { saveMessages };
