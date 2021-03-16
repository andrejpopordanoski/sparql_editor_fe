import { colors } from 'styles';

export const basicStyles = {
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
    },
    paddingContainer: {
        paddingLeft: 25,
        paddingRight: 25,
    },
    paddingSecoundaryContrainer: {
        paddingLeft: 12.5,
        paddingRight: 12.5,
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    menuTitlesWrapper: {
        paddingTop: 70,
        paddingBottom: 24,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        flexGrow: 1,
        flexBasis: 0,
    },
};

export const headers = {
    H1: function (color, fontType, size) {
        return {
            color: color ? color : colors.primaryText(),
            fontSize: size ? size : 26,
            fontFamily: fontType ? 'Helvetica-' + fontType : 'Helvetica-Regular',
        };
    },
    H2: function (color, fontType, size) {
        return {
            color: color ? color : colors.primaryText(),
            fontSize: size ? size : 22,
            fontFamily: fontType ? 'Helvetica-' + fontType : 'Helvetica-Regular',
        };
    },
    H3: function (color, fontType, size) {
        return {
            color: color ? color : colors.primaryText(),
            fontSize: size ? size : 20,
            fontFamily: fontType ? 'Helvetica-' + fontType : 'Helvetica-Regular',
        };
    },
    H4: function (color, fontType, size) {
        return {
            color: color ? color : colors.primaryText(),
            fontSize: size ? size : 18,
            fontFamily: fontType ? 'Helvetica-' + fontType : 'Helvetica-Regular',
        };
    },
    H5: function (color, fontType, size) {
        return {
            color: color ? color : colors.primaryText(),
            fontSize: size ? size : 16,
            fontFamily: fontType ? 'Helvetica-' + fontType : 'Helvetica-Regular',
        };
    },
    H6: function (color, fontType, size) {
        return {
            color: color ? color : colors.primaryText(),
            fontSize: size ? size : 14,
            fontFamily: fontType ? 'Helvetica-' + fontType : 'Helvetica-Regular',
        };
    },
};
