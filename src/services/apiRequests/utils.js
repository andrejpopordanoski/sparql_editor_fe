export const handleSuccess = (response, rest) => {
    const data = response.data;
    return {
        success: true,
        data,
    };
};

export const handleError = statusCode => {
    // console.log(statusCode);
    return {
        success: false,
    };
};
