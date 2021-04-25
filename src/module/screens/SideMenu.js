import React, { useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { colors, headers } from 'styles';
import SavedQueryOption from '../components/SavedQueryOption';
import Text from '../components/Text';
import View from '../components/View';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPublicQueriesAction, getAllQueriesAction, getSavedQueryResultAction } from 'redux/actions/data.actions';
import ToggleComponent from 'module/components/ToggleComponent';
import { Button } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import LockIcon from '@material-ui/icons/Lock';
import Pagination from '@material-ui/lab/Pagination';
import { stateIsLoaded } from 'services/stateHelpers';

export default function SideMenu({ history, useTabConfig, usePaginationPublic, usePaginationPrivate }) {
    // const [saveResponseToggle, setSaveResponseToggle] = useState(false);
    const dispatch = useDispatch(0);

    const {
        saveCheckBoxVal,
        setSaveCheckboxVal,
        setCurrentlyChosenOlderQuery,
        createNewTab,
        privateModifierCheckBoxVal,
        setPrivateModifierCheckBoxVal,
    } = useTabConfig;
    // const [queries, setQueries] = useState([]);
    const allQueries = useSelector(state => state.allQueries);
    const allPublicQueries = useSelector(state => state.allPublicQueries);

    const [queriesPreview, setQueriesPreview] = useState('private');
    const savingQueryResponse = useSelector(state => state.savingQueryResponse);

    useEffect(() => {
        console.log('page changed');

        dispatch(getAllPublicQueriesAction(usePaginationPublic.currentPage));
    }, [usePaginationPublic.currentPage]);

    useEffect(() => {
        dispatch(getAllQueriesAction(usePaginationPrivate.currentPage));
    }, [usePaginationPrivate.currentPage]);

    useEffect(() => {
        console.log(savingQueryResponse);
        if (stateIsLoaded(savingQueryResponse)) {
            dispatch(getAllPublicQueriesAction(usePaginationPublic.currentPage));
            dispatch(getAllQueriesAction(usePaginationPrivate.currentPage));
        }
    }, [savingQueryResponse]);

    // useEffect(() => {
    //     console.log(queriesPreview);
    //     if (queriesPreview === 'private') {
    //         setQueries(allQueries?.data?.data?.userQueries);
    //     } else {
    //         setQueries(allPublicQueries?.data?.data?.userQueries);
    //     }
    // }, [queriesPreview]);
    let queries = queriesPreview === 'private' ? allQueries : allPublicQueries;
    let usePagination = queriesPreview === 'private' ? usePaginationPrivate : usePaginationPublic;

    return (
        <ResizableBox
            className="custom-box box"
            width={260}
            height={'100%'}
            style={{ border: '1px solid #DDDDDD' }}
            // handleSize={[8, 8]}
            style={{ display: 'flex', flexDirection: 'row', marginRight: '10px' }}
            // resizeHandles={['e']}
            axis="x"
            minConstraints={[220, 0]}
            maxConstraints={[400, 0]}
            handle={
                <div
                    style={{
                        display: 'flex',
                        width: '10px',
                        minWidth: '10px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // background: 'gray',
                        cursor: 'col-resize',
                        left: -10,
                    }}
                >
                    <div style={{ width: 0, height: '30%', background: 'gray' }}></div>
                </div>
            }
        >
            <View style={{ width: '100%', boxShadow: `3px 0px 5px 0px ${colors.borderGrayColor()}` }}>
                <View>
                    <ToggleComponent
                        checkBoxVal={saveCheckBoxVal}
                        setCheckBoxVal={setSaveCheckboxVal}
                        description={() => 'Save queries on run'}
                    ></ToggleComponent>
                    <ToggleComponent
                        disabled={!saveCheckBoxVal}
                        checkBoxVal={privateModifierCheckBoxVal}
                        setCheckBoxVal={setPrivateModifierCheckBoxVal}
                        description={value => `Save access set to ${value === true ? 'PRIVATE' : 'PUBLIC'}`}
                    ></ToggleComponent>
                </View>
                <View>
                    <Text style={{ ...headers.H4(null, 'Regular'), marginLeft: 10, marginTop: 15, marginBottom: 5 }}> Saved queries </Text>
                    <View
                        style={{
                            marginTop: 20,
                            borderBottom: `1px solid ${colors.borderGrayColor()}`,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 5,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Button
                                style={{ borderBottom: queriesPreview === 'private' ? '2px solid orange' : null, borderRadius: 0 }}
                                // style={{ borderBottom: previewType === 'response' ? '2px solid orange' : null, borderRadius: 0 }}
                                startIcon={<LockIcon color={queriesPreview === 'private' ? 'primary' : 'secondary'}></LockIcon>}
                                onClick={() => {
                                    setQueriesPreview('private');
                                }}
                            >
                                PRIVATE
                            </Button>
                            <Button
                                style={{ borderBottom: queriesPreview === 'public' ? '2px solid orange' : null, borderRadius: 0 }}
                                startIcon={<PublicIcon color={queriesPreview === 'public' ? 'primary' : 'secondary'}></PublicIcon>}
                                onClick={() => {
                                    setQueriesPreview('public');
                                }}
                            >
                                PUBLIC
                            </Button>
                        </View>
                    </View>
                    {queries &&
                        queries?.data?.data?.userQueries.map(el => {
                            return (
                                <SavedQueryOption
                                    onClick={() => {
                                        // setCurrentlyChosenOlderQuery(el);
                                        let newTab = {
                                            sparqlQueryVal: el.queryString,
                                            url: el.url,
                                            graphNameIri: el.defaultDatasetName,
                                            timeOutVal: el.timeout,
                                            format: el.format,
                                            queryNameVal: el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : ''),
                                        };
                                        dispatch(getSavedQueryResultAction(el.format, el.id));
                                        createNewTab(newTab, queriesPreview === 'public', el.id);
                                        if (queriesPreview === 'public') {
                                            history.replace('/sparql?query_id=' + el.id);
                                        }
                                    }}
                                    name={el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : '')}
                                    url={el.url}
                                    author={el.userEmail}
                                    showAuthor={queriesPreview === 'public'}
                                ></SavedQueryOption>
                            );
                        })}
                    <Pagination
                        page={usePagination.currentPage + 1}
                        count={queries?.data?.data?.totalPages}
                        onChange={(_, page) => {
                            usePagination.setCurrentPage(page - 1);
                        }}
                    />
                </View>
            </View>
        </ResizableBox>
    );
}
