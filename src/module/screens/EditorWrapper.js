import { Button, FormControl, Select, Typography, InputLabel, MenuItem } from '@material-ui/core';
import CustomizedSelects from 'module/components/CustomSelect';
import { AntTab, useStyles, AntTabs } from 'module/components/CustomTabs';
import Text from 'module/components/Text';
import View from 'module/components/View';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from 'redux/actions/auth.actions';
import { tokenHelper } from 'services/tokenHelpers';
import Editor from './Editor';
import { useTabConfig } from './useTabConfig';
import AddIcon from '@material-ui/icons/Add';
import { palette } from 'styles/pallete';
import { colors, headers } from 'styles';
import SideMenu from 'module/screens/SideMenu';
import { getAllQueriesAction, getSinglePublicQueryAction } from 'redux/actions/data.actions';
import { usePagination } from './usePagination';
import queryString from 'query-string';

export default function EditorWrapper({ history }) {
    // const [loggedIn, setLoggedIn] = useState(tokenHelper.auth());
    // const [currentTab, setCurrentTab] = useState(0);
    // const [tabs, setTabs] = useState(['Unsaved query']);
    const allQueries = useSelector(state => state.allQueries);

    // const savedQueryOptions = allQueries.data.data
    //     ? allQueries?.data?.data.map(el => {
    //           return { name: el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : ''), value: el };
    //       })
    //     : [];
    const useTabs = useTabConfig(history);
    const usePaginationPublic = usePagination();
    const usePaginationPrivate = usePagination();
    const singlePublicQuery = useSelector(state => state.singlePublicQuery);

    const classes = useStyles();

    const authState = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        useTabs.setCurrentTab(newValue);
    };
    let loggedIn = authState.data?.data?.access_token;

    useEffect(() => {
        if (history.location.search) {
            console.log(history.location.search);
            let params = queryString.parse(history.location.search);
            console.log(params);
            if (params.query_id) {
                dispatch(getSinglePublicQueryAction(params.query_id));
                // useTabs.createNewTab();
            }
        }
    }, []);

    useEffect(() => {
        if (singlePublicQuery.data.data) {
            let el = singlePublicQuery.data.data;
            let newTab = {
                sparqlQueryVal: el.queryString,
                url: el.url,
                graphNameIri: el.defaultDatasetName,
                timeOutVal: el.timeout,
                format: el.format,
                queryNameVal: el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : ''),
            };
            // dispatch(getSavedQueryResultAction(el.format, el.id));
            useTabs.createNewTab(newTab, true, el.id);

            history.replace('/sparql?query_id=' + el.id);
        }
    }, [singlePublicQuery]);

    // useEffect(() => {
    //     console.log(history);
    //     if (history.location.search) {
    //         let params = queryString.parse(history.location.search);
    //         console.log(params);
    //         if (params.query_id) {
    //             useTabs.createNewTab();
    //         }
    //     }
    // }, [useTabs.localhostLoaded]);

    return (
        <View style={{ flex: 1 }}>
            <View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#303030' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ ...headers.H3('white'), paddingLeft: 20 }}> SPARQL Editor </Text>
                    </View>
                    {loggedIn && (
                        <Button
                            variant="outlined"
                            color="primary"
                            style={{ justifySelf: 'flex-end' }}
                            onClick={() => {
                                // dispatch(lo);
                                dispatch(logoutAction());
                            }}
                        >
                            Logout
                        </Button>
                    )}
                    {!loggedIn && (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 20 }}
                                onClick={() => {
                                    // dispatch(lo);
                                    history.replace('/login');
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    // dispatch(lo);
                                    history.replace('/register');
                                }}
                            >
                                Register
                            </Button>
                        </>
                    )}
                </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                {loggedIn && (
                    <SideMenu
                        history={history}
                        useTabConfig={useTabs}
                        usePaginationPublic={usePaginationPublic}
                        usePaginationPrivate={usePaginationPrivate}
                    ></SideMenu>
                )}
                <View style={{ flex: 1 }}>
                    <View>
                        <div>
                            <AntTabs color="primary" value={useTabs.currentTab} onChange={handleChange} aria-label="ant example">
                                {useTabs.tabsLabels.map((el, index) => {
                                    return (
                                        <AntTab
                                            label={el}
                                            key={index}
                                            onClosePress={() => {
                                                useTabs.closeTab(index);
                                            }}
                                        />
                                    );
                                })}

                                <View
                                    style={{
                                        marginTop: 5,
                                        border: `1px solid ${colors.backgroundLightGray2()}`,
                                        borderBottom: '2px solid white',
                                        padding: '0 2px',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {/* <div
                                        onClick={() => {
                                            // setTabs([...tabs, 'Unsaved query']);
                                            useTabs.createNewTab();
                                            // useTabs.setCurrentTab(tabs.length);
                                        }}
                                        style={{ width: 30, height: 30, marginTop: 0 }}
                                        className="plus alt"
                                    ></div> */}
                                    <AddIcon
                                        // style={{ color: palette.secondary.light }}
                                        // color="secondary light"
                                        fontSize={'large'}
                                        onClick={() => {
                                            // setTabs([...tabs, 'Unsaved query']);
                                            useTabs.createNewTab();
                                            // useTabs.setCurrentTab(tabs.length);
                                        }}
                                        style={{ width: 30, height: 30, color: palette.secondary.light }}
                                    />
                                    {/* <Button style={{ width: 30, height: 30 }} startIcon={<AddIcon />}></Button> */}
                                </View>
                            </AntTabs>
                            {/* <Typography className={classes.padding} /> */}
                        </div>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Editor
                            useTabConfig={useTabs}
                            currentTab={useTabs.currentTab}

                            // hidden={true}
                            // style={{ display: useTabs.currentTab === index ? 'flex' : 'none' }}
                        ></Editor>
                    </View>
                </View>
            </View>
        </View>
    );
}
