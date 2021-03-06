import { makeStyles, Tab, Tabs, withStyles } from '@material-ui/core';
import { useState } from 'react';
import { palette } from 'styles/pallete';

import { colors } from 'styles';
import CloseIcon from '@material-ui/icons/Close';
export const AntTabs = withStyles(() => ({
    root: {
        borderBottom: '1px solid #e8e8e8',
        '&$selected': {
            border: '2px solid black',
        },
    },
    indicator: {
        backgroundColor: palette.primary.main,
    },
}))(Tabs);

export const AntTab = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 100,
        padding: 0,
        paddingLeft: 10,
        height: 35,
        minHeight: 35,
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: 14,
        // marginRight: theme.spacing(4),
        fontFamily: ['Helvetica-Medium'].join(','),
        '&:hover': {
            color: colors.borderGrayColor(),
            opacity: 1,
        },
        '&$selected': {
            color: palette.secondary.main,
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            // color: palette.primary.main,
        },
    },
    selected: {},
}))(props => {
    const [closeButtonVisible, setCloseButtonVisible] = useState(false);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: props.selected ? 'rgb(245,245,245)' : 'rgb(250,250,250)',
                // borderLeft: '1px solid rgb(235,235,235)',
                margin: 5,
                marginBottom: 0,
                border: `1px solid ${colors.backgroundLightGray2(50)}`,
            }}
            onMouseEnter={() => {
                if (!closeButtonVisible) {
                    setCloseButtonVisible(true);
                }
            }}
            onMouseLeave={() => {
                if (closeButtonVisible) {
                    setCloseButtonVisible(false);
                }
            }}
        >
            <Tab disableRipple {...props} />
            <CloseIcon
                onClick={() => {
                    props.onClosePress();
                }}
                style={{ width: 20, height: 20, opacity: closeButtonVisible ? 1 : 0, paddingRight: 5 }}
            ></CloseIcon>
            {/* <div
                style={{ width: 25, height: 25, opacity: closeButtonVisible ? 1 : 0 }}
                onClick={() => {
                    props.onClosePress();
                }}
                // className="close alt2"
            ></div> */}
        </div>
    );
});

export const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        padding: theme.spacing(3),
    },
    demo1: {
        backgroundColor: theme.palette.background.paper,
    },
    demo2: {
        backgroundColor: '#2e1534',
    },
}));
