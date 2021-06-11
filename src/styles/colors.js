function createColorWithOpacity(color, opacity) {
    opacity = Math.floor(opacity * (255 / 100));
    if (!opacity && opacity !== 0) return color;
    return color + opacity.toString(16);
}

export const colors = {
    background: function (opacity) {
        return createColorWithOpacity('#7BC6C3', opacity);
    },

    themePrimary: function (opacity) {
        return createColorWithOpacity('#86CDCA', opacity);
    },

    borderGrayColor: function (opacity) {
        return createColorWithOpacity('#D7D7D6', opacity);
    },
    backgroundLightGray: function (opacity) {
        return createColorWithOpacity('#FAFAFA', opacity);
    },
    backgroundLightGray1: function (opacity) {
        return createColorWithOpacity('#F0F0F0', opacity);
    },
    backgroundLightGray2: function (opacity) {
        return createColorWithOpacity('#D2D2D2', opacity);
    },

    primaryText: function (opacity) {
        return createColorWithOpacity('#303030', opacity);
    },
    secoundaryText: function (opacity) {
        return createColorWithOpacity('#6F6F6F', opacity);
    },

    disabled: function (opacity) {
        return createColorWithOpacity('#B9B9B9', opacity);
    },
    error: function (opacity) {
        return createColorWithOpacity('#E31515', opacity);
    },
};

// function createColorStyles(type) {
//     let obj = {};
//     for (let color in colors) {
//         if (colors.hasOwnProperty(color)) {
//             if (type === 'background') obj[`${color}`] = { backgroundColor: `${colors[color]}` };
//             else if (type === 'color') obj[`${color}`] = { color: `${colors[color]}` };
//         }
//     }

//     return obj;
// }

// export const backgroundColorStyles = StyleSheet.create(createColorStyles('background'));

// export const textColorStyles = StyleSheet.create(createColorStyles('color'));
