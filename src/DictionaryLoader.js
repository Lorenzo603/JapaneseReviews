export const loadDictionary = (rawData) => {
    const resultDictionary = [];
    rawData['data'].forEach(item => {
        resultDictionary.push(item);
    });
    return resultDictionary;
}
