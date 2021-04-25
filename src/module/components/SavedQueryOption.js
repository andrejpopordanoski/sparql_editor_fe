import React, { useState } from 'react';
import { colors, headers } from 'styles';
import Text from './Text';
import View from './View';

export default function SavedQueryOption({ name, url, onClick, author, showAuthor }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <View
            onClick={onClick}
            style={{
                flex: 1,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
                cursor: 'pointer',
                background: isHovered ? colors.backgroundLightGray2() : colors.backgroundLightGray(),
                borderBottom: `1px solid ${colors.borderGrayColor(50)}`,
            }}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            <Text style={{ ...headers.H5(null, 'Italic'), paddingBottom: 5 }}> {name} </Text>
            <Text style={{ ...headers.H6(null, 'Light'), wordWrap: 'break-word' }}>{url}</Text>
            {showAuthor && (
                <Text style={{ ...headers.H6(null, 'Light', 12), wordWrap: 'break-word', paddingTop: 5 }}>
                    by <Text style={{ ...headers.H6(null, 'Bold', 12) }}>{author}</Text>
                </Text>
            )}
        </View>
    );
}
