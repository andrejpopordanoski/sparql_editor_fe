function createColorWithOpacity(color, opacity) {
    opacity = Math.floor(opacity * (255 / 100));
    if (!opacity && opacity !== 0) return color;
    return color + opacity.toString(16);
}

export const colors = {
    sideBar: function (opacity) {
        return createColorWithOpacity('#3BA998', opacity);
    }, // zolta
    background: function (opacity) {
        return createColorWithOpacity('#7BC6C3', opacity);
    },
    workoutDone: function (opacity) {
        return createColorWithOpacity('#A4E475', opacity);
    },
    workoutRestDay: function (opacity) {
        return createColorWithOpacity('#8675E4', opacity);
    },

    workoutNotAnswered: function (opacity) {
        return createColorWithOpacity('#FFFF00', opacity);
    }, // Vrz zoltata posvetla,
    workoutFailed: function (opacity) {
        return createColorWithOpacity('#E37373', opacity);
    },
    themePrimary: function (opacity) {
        return createColorWithOpacity('#86CDCA', opacity);
    },
    themeSecoundary: function (opacity) {
        return createColorWithOpacity('#41B3A3', opacity);
    },
    themeActive: function (opacity) {
        return createColorWithOpacity('#E27D60', opacity);
    },
    themeActive2: function (opacity) {
        return createColorWithOpacity('#E8A87C', opacity);
    },
    themeDull: function (opacity) {
        return createColorWithOpacity('#C38D9E', opacity);
    },
    lightGreen: function (opacity) {
        return createColorWithOpacity('#E7F9FA', opacity);
    },

    primaryText: function (opacity) {
        return createColorWithOpacity('#5C5C5C', opacity);
    },
    secoundaryText: function (opacity) {
        return createColorWithOpacity('#6F6F6F', opacity);
    },
    lightText: function (opacity) {
        return createColorWithOpacity('#ADADAD', opacity);
    },
    borderGrayColor: function (opacity) {
        return createColorWithOpacity('#BFBFBF', opacity);
        // return createColorWithOpacity('#ced4da', opacity);

        // ced4da
    },
    optionsColor: function (opacity) {
        return createColorWithOpacity('#F0F0F0', opacity);
    },
    disabled: function (opacity) {
        return createColorWithOpacity('#B9B9B9', opacity);
    },
};

function createColorStyles(type) {
    let obj = {};
    for (let color in colors) {
        if (colors.hasOwnProperty(color)) {
            if (type === 'background') obj[`${color}`] = { backgroundColor: `${colors[color]}` };
            else if (type === 'color') obj[`${color}`] = { color: `${colors[color]}` };
        }
    }
    // console.log(obj);
    return obj;
}

// export const backgroundColorStyles = StyleSheet.create(createColorStyles('background'));

// export const textColorStyles = StyleSheet.create(createColorStyles('color'));
