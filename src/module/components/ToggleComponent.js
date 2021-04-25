import React from 'react';

import { colors, headers } from 'styles';

import Text from '../components/Text';
import View from '../components/View';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

export default function ToggleComponent({ checkBoxVal, setCheckBoxVal, description, disabled }) {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 5,
                background: colors.backgroundLightGray1(),
                border: colors.borderGrayColor(),
                opacity: !disabled ? 1 : 0.3,
            }}
        >
            <View
                style={{ paddingRight: 10, cursor: 'pointer' }}
                onClick={() => {
                    if (!disabled) {
                        setCheckBoxVal(!checkBoxVal);
                    }
                }}
            >
                {!checkBoxVal && <ToggleOffIcon color="secondary" fontSize="large"></ToggleOffIcon>}
                {checkBoxVal && <ToggleOnIcon fontSize="large" color="primary"></ToggleOnIcon>}
            </View>
            <View>
                <Text style={{ ...headers.H5(null, 'Light') }}> {description(checkBoxVal)} </Text>
            </View>
        </View>
    );
}
