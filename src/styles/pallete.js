import { colors } from './colors';

export const palette = {
    primary: {
        main: colors.themePrimary(),
    },
    secondary: {
        main: '#323232',
        light: '#8a8a8a',
    },
    description: {
        main: '#8c8c8c',
    },
    tabs: {
        deselected: '#808080',
    },
    background: {
        main: '#ebebeb',
        dropzone: '#f2f2f2',
        paper: 'white',
        input: '#f9f9f9',
    },
    border: {
        separator: '#dcdcdc',
    },
    menu: {
        active: 'white',
        inactive: '#8F8E8D',
    },
};

export const INITIAL_STATE = {
    palette,
};
