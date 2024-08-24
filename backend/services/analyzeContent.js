// analyzeContent.js

const language = require('@google-cloud/language');

// Creates a client for the Natural Language API
const languageClient = new language.LanguageServiceClient();

// Custom list of keywords indicative of explicit content
const explicitKeywords = [
    "Pervy Dad", "Steals College Cutie", "Onlyfans", "🔞", "Download Links", "Watch Online", "👀",
    "Premium", "January 7, 2024", "BellaBlu", "MickBlue", "https://1024terabox.com"
];

async function analyzeTextForExplicitContent(text) {
    try {
        // Custom keyword detection
        const lowerCaseText = text.toLowerCase();
        const keywordFound = explicitKeywords.some(keyword =>
            lowerCaseText.includes(keyword.toLowerCase())
        );

        if (keywordFound) {
            console.log('Explicit content detected based on custom keywords.');
            return true;
        }

        // Google Cloud Natural Language API - Classifies the text into categories
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        const [classificationResult] = await languageClient.classifyText({ document });
        const categories = classificationResult.categories;

        console.log('Categories:');
        categories.forEach(category => console.log(`Name: ${category.name}, Confidence: ${category.confidence}`));

        // Check for explicit content or related categories
        const explicitCategories = categories.filter(category =>
            category.name.includes('Adult') ||
            category.name.includes('Scam') ||
            category.name.includes('Illegal')
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

// Example usage
(async () => {
    const text = `https://1024terabox.com/s/1dHyV70g6MuMyjR7sZOfYgA
    https://1024terabox.com/s/17dTMafLReIO0DQKrhhPyWg
    📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐋𝐢𝐧𝐤𝐬/👀𝐖𝐚𝐭𝐜𝐡 𝐎𝐧𝐥𝐢𝐧𝐞

    Video 1. 👉 https://1024terabox.com/s/17d4z63hnxjYON2TYNu0nGQ
    ‼️NEW‼️
    https://1024terabox.com/s/1dn2JBiCv4pyASNOEZEIbSw
    [ 😈 𝗣𝗿𝗲𝗺𝗶𝘂𝗺 𝗢𝗻𝗹𝘆𝗳𝗮𝗻𝘀  🔞]
    https://1024terabox.com/s/1dn2JBiCv4pyASNOEZEIbSw
    January 7, 2024
    Pervy Dad Steals College Cutie
    #BellaBlu, #MickBlue
    =➖=➖=➖=➖=➖=➖=➖=➖=
    [📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 X 𝐖𝐚𝐭𝐜𝐡 𝐎𝐧𝐥𝐢𝐧𝐞 📺]

    =➖=➖=➖=➖=➖=➖=➖=➖=
    🔰 𝗝𝗼𝗶𝗻 𝗨ŝ 𝗢ɴ 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 🔞`;

    const isExplicit = await analyzeTextForExplicitContent(text);
    console.log('Is Explicit:', isExplicit);
})();

module.exports = { analyzeTextForExplicitContent };
