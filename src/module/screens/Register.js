import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { stateHasFailed, stateIsLoaded } from '../../services/stateHelpers';

import { headers, colors } from 'styles';
import View from 'module/components/View';
import Text from 'module/components/Text';
import { Button, TextField } from '@material-ui/core';
import { passwordLoginAction, registerUserAction } from 'redux/actions/auth.actions';
import { tokenHelper } from 'services/tokenHelpers';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { palette } from 'styles/pallete';
import { validateEmail } from 'services/stringHelpers';

export default function RegisterScreen({ history }) {
    const dispatch = useDispatch();
    const registerState = useSelector(state => state.register.register);
    const authState = useSelector(state => state.auth);
    let loggedIn = tokenHelper.auth();
    const [registerError, setRegisterError] = useState('');
    useEffect(() => {
        console.log(registerState);
        if (stateIsLoaded(registerState)) {
            dispatch(passwordLoginAction(username, password));
        }
        if (stateHasFailed(registerState)) {
            console.log('here');
            setRegisterError('User with given username is already in our database');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registerState, dispatch]);

    // const authState = useSelector(state => state.auth);
    // if (stateIsLoaded(authState) && authState.persisted) {
    //     history.replace('/');
    // }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');

    if (stateIsLoaded(authState) && loggedIn) {
        return <Redirect to="/sparql" />;
    }

    const register = () => {
        if (!username || !validateEmail(username)) {
            setUsernameErrorMessage('Invalid email. Please write your email in the following format: someone@example.com');
            return;
        } else if (!password) {
            setUsernameErrorMessage('');
            setPasswordErrorMessage('Password cannot be empty');
            return;
        } else if (password.length < 8) {
            setUsernameErrorMessage('');
            setPasswordErrorMessage('Password should be at least 8 characters long');
            return;
        } else if (!firstName) {
            setUsernameErrorMessage('');
            setPasswordErrorMessage('');
            setFirstNameErrorMessage('First name cannot be empty');
            return;
        } else if (!lastName) {
            setUsernameErrorMessage('');
            setPasswordErrorMessage('');
            setFirstNameErrorMessage('');
            setLastNameErrorMessage('Last name cannot be empty');
            return;
        } else {
            setUsernameErrorMessage('');
            setPasswordErrorMessage('');
            setFirstNameErrorMessage('');
            setLastNameErrorMessage('');
        }
        dispatch(registerUserAction(username, password, firstName, lastName));
    };

    return (
        <View style={{ height: '100vh', backgroundColor: colors.background(10), flex: 1 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 400, padding: 20, backgroundColor: '#FFFFFF', boxShadow: '-10px 12px 15px -1px rgba(0,0,0,0.4)' }}>
                    <Text
                        style={{
                            fontSize: 30,
                            textAlign: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: colors.borderGrayColor(50),
                            paddingBottom: 20,
                            ...headers.H1(),
                        }}
                    >
                        Create your account
                    </Text>
                    <View style={{ paddingBottom: 30 }}>
                        <TextField
                            name={'username'}
                            variant="outlined"
                            label={'Username'}
                            color={'secondary'}
                            error={usernameErrorMessage.length > 0}
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
                            error={passwordErrorMessage.length > 0}
                            helperText={passwordErrorMessage}
                            onChange={event => setPassword(event.target.value)}
                            value={password}
                            style={{ marginTop: 30, marginLeft: 20, marginRight: 20 }}
                        ></TextField>
                        <TextField
                            name={'firstName'}
                            variant="outlined"
                            label={'First Name'}
                            color={'secondary'}
                            error={firstNameErrorMessage.length > 0}
                            helperText={firstNameErrorMessage}
                            onChange={event => setFirstName(event.target.value)}
                            value={firstName}
                            style={{ marginTop: 40, marginLeft: 20, marginRight: 20, ...headers.H5() }}
                        ></TextField>
                        <TextField
                            name={'lastName'}
                            variant="outlined"
                            label={'Last name'}
                            color={'secondary'}
                            error={lastNameErrorMessage.length > 0}
                            helperText={lastNameErrorMessage}
                            onChange={event => setLastName(event.target.value)}
                            value={lastName}
                            style={{ marginTop: 30, marginLeft: 20, marginRight: 20 }}
                        ></TextField>
                        {registerError.length > 0 && (
                            <View style={{ justifyContent: 'center', flex: 1, marginTop: 30 }}>
                                <Text style={{ ...headers.H5(colors.error()), textAlign: 'center' }}>{registerError}</Text>
                            </View>
                        )}
                        <Link
                            onClick={() => {
                                history.replace('/login');
                            }}
                            style={{ fontSize: 13, textAlign: 'center', marginTop: 30, ...headers.H5() }}
                        >
                            Already have an account? Click <Text>here to login</Text>.
                        </Link>
                        <Button
                            variant="contained"
                            style={{
                                alignSelf: 'flex-end',
                                marginTop: 20,
                                backgroundColor: palette.primary.main,
                                color: 'white',
                            }}
                            onClick={() => {
                                // login();
                                register();
                            }}
                        >
                            Register
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}
