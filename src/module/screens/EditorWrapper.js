import { Button, Typography } from '@material-ui/core';
import { AntTab, useStyles, AntTabs } from 'module/components/CustomTabs';
import View from 'module/components/View';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from 'redux/actions/auth.actions';
import { tokenHelper } from 'services/tokenHelpers';
import Editor from './Editor';
import { useTabConfig } from './useTabConfig';

export default function EditorWrapper({ history }) {
    const [loggedIn, setLoggedIn] = useState(tokenHelper.auth());
    const [currentTab, setCurrentTab] = useState(0);
    const [tabs, setTabs] = useState(['Unsaved query']);

    // const useTabs = useTabConfig();

    // const [tabConfigs, setTabConfigs] = useState([useTabConfig, useTabConfig]);
    // const tabConfing1 = useTabConfig();
    // const tabConfing2 = useTabConfig();

    // console.log(tabConfing2 === tabConfing1, 'are those same?');

    const classes = useStyles();

    const authState = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        console.log(newValue);
        setCurrentTab(newValue);
    };

    useEffect(() => {
        setLoggedIn(tokenHelper.auth());
    }, [authState]);

    return (
        <View style={{ flex: 1 }}>
            <View>
                {loggedIn && (
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Button
                            onClick={() => {
                                // dispatch(lo);
                                dispatch(logoutAction());
                            }}
                        >
                            Logout
                        </Button>
                    </View>
                )}
                {!loggedIn && (
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        <Button
                            onClick={() => {
                                // dispatch(lo);
                                history.replace('/login');
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => {
                                // dispatch(lo);
                                history.replace('/register');
                            }}
                        >
                            Register
                        </Button>
                    </View>
                )}
            </View>
            <View>
                <div className={classes.demo1}>
                    <AntTabs value={currentTab} onChange={handleChange} aria-label="ant example">
                        {tabs.map(el => {
                            return <AntTab label={el} />;
                        })}

                        <View>
                            <div
                                onClick={() => {
                                    setTabs([...tabs, 'Unsaved query']);
                                    setCurrentTab(tabs.length);
                                }}
                                style={{ width: 30, height: 30 }}
                                className="plus alt"
                            ></div>
                        </View>
                    </AntTabs>
                    <Typography className={classes.padding} />
                </div>
            </View>
            {tabs.map((el, index) => {
                return (
                    <Editor currentTab={currentTab} index={index} hidden={true} style={{ display: currentTab === index ? 'flex' : 'none' }}></Editor>
                );
            })}
            {/* <Editor hidden={true} ></Editor> */}
        </View>
    );
}
