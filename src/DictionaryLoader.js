export const loadDictionary = (rawData) => {
    const resultDictionary = [];
    rawData['data']
    .filter(item => item['data']['hidden_at'] === null)
    .forEach(item => {
        resultDictionary.push(item);
    });
    return resultDictionary;
}
