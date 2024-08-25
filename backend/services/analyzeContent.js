const fs = require('fs');
const path = require('path');
const vision = require('@google-cloud/vision');

const visionClient = new vision.ImageAnnotatorClient();

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../notional-fusion-428301-s9-bfc944d1eb09.json');

const sightengineUser = '988185572';
const sightengineSecret = 'hvynp7cZYXfBkoEj2nGm6JJgtZvdSiKK';

// Function to remove emojis and special characters
const removeEmojisAndSpecialChars = (text) => {
    const normalizedText = text.normalize('NFKD').replace(/[\u0300-\u036F]/g, '')
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
        .trim()                                      // Remove leading and trailing space
        .slice(0, 300);
};


function analyzeText() {
    const filePath = path.join(__dirname, '../data/text.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');


    const cleanedText = removeEmojisAndSpecialChars(fileContent);
    console.log(cleanedText);

    const url = `https://api.sightengine.com/1.0/text/check.json?text=${encodeURIComponent(cleanedText)}&lang=en&mode=standard&api_user=${sightengineUser}&api_secret=${sightengineSecret}`;

    fetch(url)
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => {
            // console.log('API Response:', data); // Log the entire response to inspect its structure
            console.log(data.profanity);


            if (data && data.offensive) {
                const categories = data.offensive.categories;

                if (categories.sexual > 0.5) {
                    console.log('Sexual content detected');
                } else {
                    console.log('No sexual content detected');
                }
            } else {
                console.error('Unexpected API response format.');
            }
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });
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
