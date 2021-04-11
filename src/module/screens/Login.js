import { Button, ButtonBase, TextField } from '@material-ui/core';
import Text from 'module/components/Text';
import View from 'module/components/View';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { passwordLoginAction } from 'redux/actions/auth.actions';
import { stateHasFailed, stateIsLoaded } from 'services/stateHelpers';
import { tokenHelper } from 'services/tokenHelpers';
import { basicStyles, colors, headers } from 'styles';
import { palette } from 'styles/pallete';

export default function Login({ history }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const []
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const authState = useSelector(state => state.auth);

    const dispatch = useDispatch();

    let loggedIn = tokenHelper.auth();

    useEffect(() => {
        if (stateHasFailed(authState)) {
            setErrorMsg(authState.error);
        }
    }, [authState]);
    const toRegister = () => {
        history.replace('/register');
    };

    if (stateIsLoaded(authState) && loggedIn) {
        return <Redirect to="/sparql" />;
    }

    const login = () => {
        console.log(username, password);
        if (!username.length) {
            setUsernameError(true);
            setUsernameErrorMessage('username cannot be empty');
        }
        if (!password.length) {
            setPasswordError(true);
            setPasswordErrorMessage('password cannot be empty');
        } else {
            setPasswordError(false);
            setUsernameError(false);
            dispatch(passwordLoginAction(username, password));
        }
    };

    return (
        <View
            style={{
                height: '100vh',
                backgroundColor: colors.background(10),
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <View style={{ width: 400, padding: 20, backgroundColor: '#FFFFFF', boxShadow: '-10px 12px 15px -1px' + ' rgba(0,0,0,0.4)' }}>
                <Text
                    style={{
                        ...headers.H1('black'),
                        textAlign: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.borderGrayColor(50),
                        paddingBottom: 20,
                    }}
                >
                    Login to continue
                </Text>
                <TextField
                    name={'username'}
                    variant="outlined"
                    label={'Username'}
                    color={'secondary'}
                    error={usernameError}
                    helperText={usernameErrorMessage}
                    onChange={event => setUsername(event.target.value)}
                    value={username}
                    style={{ marginTop: 40, marginLeft: 20, marginRight: 20, ...headers.H5() }}
                ></TextField>
                <TextField
                    name={'password'}
                    variant="outlined"
                    label={'Password'}
                    color={'secondary'}
                    type={'password'}
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    onChange={event => setPassword(event.target.value)}
                    value={password}
                    style={{ marginTop: 30, marginLeft: 20, marginRight: 20 }}
                ></TextField>
                {errorMsg && (
                    <View style={{ justifyContent: 'center', flex: 1, marginTop: 30 }}>
                        <Text style={{ ...headers.H5(colors.error()), textAlign: 'center' }}>Something went wrong while processing the request </Text>
                    </View>
                )}
                <Link onClick={toRegister} style={{ fontSize: 13, textAlign: 'center', marginTop: 30, ...headers.H5() }}>
                    Not registered yet? Click <Text>here to register</Text>.
                </Link>
                <View>
                    <Link
                        onClick={() => {
                            history.replace('/sparql');
                        }}
                        style={{ fontSize: 13, textAlign: 'center', marginTop: 30, ...headers.H5() }}
                    >
                        Continue without logging in
                    </Link>
                </View>
                <Button
                    variant="contained"
                    style={{
                        alignSelf: 'flex-end',
                        marginTop: 20,
                        backgroundColor: palette.primary.main,
                        color: 'white',
                    }}
                    onClick={() => {
                        login();
                    }}
                >
                    Login{' '}
                </Button>
            </View>
        </View>
    );
}
