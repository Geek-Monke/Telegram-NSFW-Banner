const vision = require('@google-cloud/vision');
const language = require('@google-cloud/language');

const visionClient = new vision.ImageAnnotatorClient();
const languageClient = new language.LanguageServiceClient();

async function analyzeText(texts) {
    console.log("Controll reaching here");

    const explicitResults = [];
    for (const text of texts) {
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };
        const [result] = await languageClient.analyzeEntities({ document });
        const explicit = result.entities.some(entity => entity.name.includes('explicit'));
        if (explicit) explicitResults.push(text);
    }
    return explicitResults;
}

async function analyzeImages(images) {
    const explicitResults = [];
    for (const image of images) {
        const [result] = await visionClient.safeSearchDetection(image);
        const detections = result.safeSearchAnnotation;
        if (detections.adult === 'LIKELY' || detections.adult === 'VERY_LIKELY') {
            explicitResults.push(image);
        }
    }
    return explicitResults;
}

module.exports = { analyzeText, analyzeImages };
