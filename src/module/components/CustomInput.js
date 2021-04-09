import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import NumberFormat from 'react-number-format';

import FormControl from '@material-ui/core/FormControl';

import { headers, colors } from 'styles';
import { InputLabel } from '@material-ui/core';

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            isNumericString
            prefix="$"
        />
    );
}

const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(2),
            flexBasis: '100%',
        },
    },
    input: {
        // borderRadius: 5,
        // position: 'relative',
        // backgroundColor: theme.palette.common.white,
        borderBottom: `1px solid ${colors.borderGrayColor()}`,
        backgroundColor: colors.backgroundLightGray(),
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        // // fontSize: 14,
        // width: '100%',
        // height: 'auto',
        padding: '10px 12px',
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

export default function CustomInput({ style, value, setValue, maxSize, type, label }) {
    // const [localValue, setLocalValue] = useState(value);
    const STANDARD_INPUT_WIDTH = 200;

    return (
        <FormControl style={{ ...style, maxWidth: maxSize ? maxSize : STANDARD_INPUT_WIDTH }}>
            {label && <InputLabel id="demo-customized-select-label">{label}</InputLabel>}
            <BootstrapInput
                tabIndex="0"
                style={{
                    flexBasis: '100%',

                    minWidth: 0,
                }}
                value={value}
                onChange={event => {
                    if (type == 'number') {
                        if (!isNaN(event.target.value)) {
                            setValue(event.target.value);
                        }
                    } else {
                        setValue(event.target.value);
                    }
                }}
                inputProps={NumberFormatCustom}
                // id="bootstrap-input"
            />
        </FormControl>
    );
}
