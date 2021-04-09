import { colors } from './colors';

export const palette = {
    primary: {
        // light: will be calculated from palette.primary.main,
        main: '#F26B3A',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
        light: '#B75174',
        main: '#AB3B61',
        // dark: will be calculated from palette.secondary.main,
        // contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,

    // primary: {
    //     dark: '#455A64',
    //     main: '#607D8B',
    //     light: '#CFD8DC',
    // },
    // secondary: {
    //     main: '#323232',
    //     light: '#8a8a8a',
    // },
    // description: {
    //     main: '#8c8c8c',
    // },
    // tabs: {
    //     deselected: '#808080',
    // },
    // background: {
    //     main: '#ebebeb',
    //     dropzone: '#f2f2f2',
    //     paper: 'white',
    //     input: '#f9f9f9',
    // },
    // border: {
    //     separator: '#BDBDBD',
    // },
    // menu: {
    //     active: '#FAFAFA',
    //     inactive: '#8F8E8D',
    // },
};

export const INITIAL_STATE = {
    palette,
};
