import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
        // backgroundColor: 'rgb(250,250,250)',

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

const useStyles = makeStyles(() => ({
    margin: {
        margin: 0,
    },
}));

export default function CustomizedSelects({ label, options, currentOption, setCurrentOption, onSelect, style }) {
    const classes = useStyles();

    return (
        <div>
            <FormControl>
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
                    {options?.map((el, index) => {
                        return (
                            <MenuItem key={index} value={el.value}>
                                {el.name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
}
