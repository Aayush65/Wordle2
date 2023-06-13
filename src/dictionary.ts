export const getDictionary = async () => {
    const response = await fetch('/assets/dictionary.json');
    const data = await response.json();
    return data;
};