const fs = require('fs');
const path = require('path');
const language = require('@google-cloud/language');

const languageClient = new language.LanguageServiceClient();

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../notional-fusion-428301-s9-bfc944d1eb09.json');


async function getExplicitKeywords() {
    try {
        const filePath = path.join(__dirname, '../data/text.txt');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return fileContent;
    } catch (error) {
        console.error('Error reading explicit keywords file:', error);
        throw error;
    }
}

async function analyzeTextForExplicitContent(text) {
    try {
        // Get the content from text.txt
        const explicitKeywordsText = await getExplicitKeywords();

        // Use the content from text.txt for analysis
        const document = {
            content: explicitKeywordsText,
            type: 'PLAIN_TEXT',
        };

        const [classificationResult] = await languageClient.classifyText({ document });
        const categories = classificationResult.categories;

        console.log('Detected Categories:');
        categories.forEach(category =>
            console.log(`Name: ${category.name}, Confidence: ${category.confidence}`)
        );

        const explicitCategories = categories.filter(category =>
            category.name.toLowerCase().includes('adult') ||
            category.name.toLowerCase().includes('scam') ||
            category.name.toLowerCase().includes('illegal')
        );

        if (explicitCategories.length > 0) {
            console.log('The text contains explicit content, adult content, or scam mentions.');
            return true;
        } else {
            console.log('The text does not contain explicit content, adult content, or scam mentions.');
            return false;
        }
    } catch (error) {
        console.error('Error analyzing text:', error);
        throw error;
    }
}

analyzeTextForExplicitContent()

// Example usage
// (async () => {
//     const text = `Your example text here...`;
//     const isExplicit = await analyzeTextForExplicitContent(text);
//     console.log('Is Explicit:', isExplicit);
// })();

module.exports = { analyzeTextForExplicitContent };
