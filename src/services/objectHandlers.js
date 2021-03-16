export const filterByValue = obj => handler => {
    let filtered = {};

    for (let [key, value] of Object.entries(obj)) {
        if (handler(value)) filtered[key] = value;
    }

    return filtered;
};
