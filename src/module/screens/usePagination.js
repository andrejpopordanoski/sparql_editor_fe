import React, { useState } from 'react';

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(0);

    return {
        currentPage,
        setCurrentPage,
    };
};
