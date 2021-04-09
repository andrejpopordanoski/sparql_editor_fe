import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import { headers, colors } from 'styles';

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(2) + 1,
            marginLeft: 0,
            width: 140,
        },
    },
    input: {
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        borderBottom: '1px solid #ced4da',
        fontSize: 15,
        minWidth: 75,
        backgroundColor: 'rgb(250,250,250)',

        paddingLeft: '10px',
        // height: 50,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        ...headers.H6(colors.primaryText(), 'Medium'),
        // fontFamily: ['Helvetica-Light'].join(','),
        '&:focus': {
            // borderRadius: 4,
            borderColor: '#80bdff',
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const BootstrapInput2 = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(2) + 1,
            marginLeft: 0,
            width: 140,
        },
    },
    input: {
        // borderRadius: 5,
        // position: 'relative',
        // backgroundColor: theme.palette.common.white,
        border: `1px solid ${colors.borderGrayColor()}`,
        borderRadius: 4,
        backgroundColor: colors.backgroundLightGray(),

        // // fontSize: 14,
        // width: '100%',
        // height: 'auto',
        minWidth: 100,
        padding: '8px 8px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        ...headers.H6(colors.primaryText(), 'Medium'),
        '&:focus': {
            // borderRadius: 5,
            borderColor: '#80bdff',
            backgroundColor: 'rgb(245,245,245)',

            // borderWidth: 2,
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 0,
    },
}));

export default function CustomizedSelects({ noSelectOpt, label, options, currentOption, setCurrentOption, onSelect, outlined, style }) {
    const classes = useStyles();
    const [age, setAge] = React.useState('');
    const handleChange = event => {
        setAge(event.target.value);
    };
    return (
        <div>
            <FormControl className={{ ...classes.margin, ...style }}>
                {label && <InputLabel id="demo-customized-select-label">{label}</InputLabel>}
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    // id="demo-simple-select-outlined"
                    value={currentOption ? currentOption : 'Not selected'}
                    onChange={event => {
                        setCurrentOption(event.target.value);
                        if (onSelect) {
                            onSelect(event.target.value);
                        }
                    }}
                    input={<BootstrapInput />}
                >
                    {/* <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}

                    {options.map(el => {
                        return <MenuItem value={el.value}>{el.name}</MenuItem>;
                    })}
                </Select>
            </FormControl>
        </div>
    );
}
