export const getDictionary = async () => {
    const response = await fetch('dictionary.json');
    const data = await response.json();
    return data;
};