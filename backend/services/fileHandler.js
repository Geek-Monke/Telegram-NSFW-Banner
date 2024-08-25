const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // Import child_process module

function saveMessages(messages) {
    console.log("Processing messages...");

    const tmeLinksSet = new Set();
    const texts = messages
        .filter(msg => msg.message)
        .map(msg => {
            let text = msg.message;

            const links = text.match(/https:\/\/t\.me[^\s]*/g);
            if (links) {
                links.forEach(link => tmeLinksSet.add(link));
            }

            text = text.replace(/https:\/\/[^\s]*/g, '');
            const cleanedText = text.replace(/^\s*[\r\n]/gm, '')
            return cleanedText
        });

    const tmeLinks = Array.from(tmeLinksSet);
    // console.log("Extracted t.me Links:", tmeLinks);
    // console.log("Cleaned Texts (without links and spaces):", texts);

    const dataFolder = path.join(__dirname, '../data');
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    const textFilePath = path.join(dataFolder, 'text.txt');
    fs.writeFileSync(textFilePath, texts.join('\n'), 'utf8');
    // console.log('Cleaned messages saved to text.txt successfully!');

    const linksFilePath = path.join(dataFolder, 'links.txt');
    fs.writeFileSync(linksFilePath, tmeLinks.join('\n'), 'utf8');
    // console.log('Extracted t.me links saved to links.txt successfully!');

    console.log('All messages processed!');

    // Call the Python script here
    // callPythonScript();
}

// function callPythonScript() {
//     const pythonScriptPath = path.join('/Users/asheshbandooadhyay/Downloads/Web Dev projects/Telegram-NSFW-Banner/backend/services/extractImages.py');

//     // Ensure the path is correctly quoted
//     exec(`python3 "${pythonScriptPath}"`, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`Error executing Python script: ${error.message}`);
//             return;
//         }
//         if (stderr) {
//             console.error(`Python stderr: ${stderr}`);
//             return;
//         }
//         console.log(`Python stdout: ${stdout}`);
//     });
// }

module.exports = { saveMessages };
