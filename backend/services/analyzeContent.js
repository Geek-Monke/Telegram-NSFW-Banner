require('dotenv').config();
const fs = require('fs');
const path = require('path');
const vision = require('@google-cloud/vision');
const fetch = require('node-fetch');


process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../notional-fusion-428301-s9-bfc944d1eb09.json');

const sightengineUser = process.env.sightengineUser;
const sightengineSecret = process.env.sightengineSecret;

// Function to remove emojis and special characters
const removeEmojisAndSpecialChars = (text) => {
    const normalizedText = text.normalize('NFKD').replace(/[\u0300-\u036F]/g, '');
    return normalizedText
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Remove emoticons
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Remove symbols & pictographs
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Remove transport & map symbols
        .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Remove alchemical symbols
        .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Remove geometric shapes extended
        .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Remove supplemental arrows-C
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Remove supplemental symbols and pictographs
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Remove chess symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Remove symbols and pictographs extended-A
        .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Remove miscellaneous symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Remove dingbats
        .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '') // Remove flags
        .replace(/[\p{S}\p{P}]/gu, '')          // Remove all other symbols and punctuation
        .replace(/[\n\r]/g, ' ')                // Replace newlines with spaces
        .replace(/\s+/g, ' ')                   // Replace multiple spaces with a single space
        .trim()                                 // Remove leading and trailing space
        .slice(0, 300);
};

async function analyzeText() {
    try {
        const filePath = path.join(__dirname, '../data/text.txt');
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const cleanedText = removeEmojisAndSpecialChars(fileContent);
        console.log(cleanedText);

        const url = `https://api.sightengine.com/1.0/text/check.json?text=${encodeURIComponent(cleanedText)}&lang=en&mode=standard&api_user=${sightengineUser}&api_secret=${sightengineSecret}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.profanity && data.profanity.matches.length > 0) {
            const matches = data.profanity.matches;
            let highOrMediumCount = 0;

            // Count the number of matches with "high" or "medium" intensity
            matches.forEach(match => {
                if (match.intensity === 'high' || match.intensity === 'medium') {
                    highOrMediumCount++;
                }
            });

            let flag = false;
            const majorityHighOrMedium = highOrMediumCount >= matches.length / 2;

            if (majorityHighOrMedium) {
                console.log('Flag set to true: High or medium intensity detected');
                flag = true;
            } else {
                console.log('Flag set to false: No significant high or medium intensity detected');
            }
            return flag;
        } else {
            console.log('No profanity detected.');
            return false;
        }
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}



// async function analyzeImageForExplicitContent(imagePath) {
//     try {
//         // Read the image file
//         const [result] = await visionClient.safeSearchDetection(imagePath);
//         const detections = result.safeSearchAnnotation;

//         console.log('Safe Search Detection Results:');
//         console.log(`Adult: ${detections.adult}`);
//         console.log(`Spoof: ${detections.spoof}`);
//         console.log(`Medical: ${detections.medical}`);
//         console.log(`Violence: ${detections.violence}`);
//         console.log(`Racy: ${detections.racy}`);

//         const explicitLabels = ['VERY_LIKELY', 'LIKELY'];

//         if (
//             explicitLabels.includes(detections.adult) ||
//             explicitLabels.includes(detections.violence) ||
//             explicitLabels.includes(detections.racy)
//         ) {
//             console.log('The image contains explicit content.');
//             return true;
//         } else {
//             console.log('The image does not contain explicit content.');
//             return false;
//         }
//     } catch (error) {
//         console.error('Error analyzing image:', error);
//         throw error;
//     }
// }

// (async () => {
//     // Provide the relative or absolute path to your image file
//     const imagePath = path.join(__dirname, '../data/photo_2024-08-25_01-26-22.jpg');

//     // Call the function and pass the image path
//     const isExplicit = await analyzeImageForExplicitContent(imagePath);

//     // Output the result
//     console.log('Is Explicit:', isExplicit);
// })();

// Example usage
// (async () => {
//     const text = `Your example text here...`;
//     const isExplicit = await analyzeTextForExplicitContent(text);
//     console.log('Is Explicit:', isExplicit);
// })();

module.exports = { analyzeText };
