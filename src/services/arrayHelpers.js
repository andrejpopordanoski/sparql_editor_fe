export const toDestructedObject = array => {
    if (array.some(item => typeof item !== 'object')) {
        throw new Error('Array does not contain objects');
    }
    return array.reduce(
        (acc, x) => ({
            ...acc,
            ...x,
        }),
        {}
    );
};
