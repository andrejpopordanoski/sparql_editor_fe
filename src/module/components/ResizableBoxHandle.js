import React from 'react';

export default function ResizableBoxHandle() {
    return (
        <div
            style={{
                width: '25%',
                height: 5,
                marginTop: 5,
                background: '#C6C6C6',
                cursor: 'row-resize',
                marginLeft: '50%',
                transform: 'translateX(-50%)',
            }}
        ></div>
    );
}
