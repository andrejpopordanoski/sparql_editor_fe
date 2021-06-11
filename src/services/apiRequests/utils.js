export const handleSuccess = (response, rest) => {
    const data = response.data;
    return {
        success: true,
        data,
    };
};

export const handleError = statusCode => {
    return {
        success: false,
    };
};
