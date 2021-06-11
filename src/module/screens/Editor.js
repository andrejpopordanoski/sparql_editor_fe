import { Button, LinearProgress } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from 'styles';

import { useDispatch, useSelector } from 'react-redux';
import { processQuery, processQueryJSON, saveQueryAction } from 'redux/actions/data.actions';

import { themes } from 'static';
import './Editor.css';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import View from 'module/components/View';
import Text from 'module/components/Text';

import { stateIsLoaded, stateIsLoading } from 'services/stateHelpers';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/hint/show-hint.css'; // without this css hints won't show
import 'codemirror/addon/search/match-highlighter';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/foldgutter.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CustomInput from 'module/components/CustomInput';

import CustomizedSelects from 'module/components/CustomSelect';
// import playIcon from 'assets/icons/play.png';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DataTable from 'react-data-table-component';
import useInterval from '@use-it/interval';
import FileCopyIcon from '@material-ui/icons/FileCopy';

// import { useTabConfig } from './useTabConfig';
// import { useTabConfig } from './useTabConfig';
require('codemirror/mode/sparql/sparql');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/turtle/turtle');
require('codemirror/mode/ntriples/ntriples');
require('codemirror/mode/htmlmixed/htmlmixed');

var CodeMirror = require('react-codemirror');
require('codemirror/lib/codemirror.css');
themes.forEach(theme => {
    require(`codemirror/theme/${theme}.css`);
});
var FileSaver = require('file-saver');
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

const SparqlParser = require('sparqljs').Parser;
const parser = new SparqlParser();

export default function Editor({ style, currentTab, useTabConfig }) {
    // const classes = useStyles();
    // const controller = new AbortController();
    // const signal = controller.signal;

    const {
        sparqlQueryVal,
        setSparqlQueryVal,
        url,
        setUrl,
        graphNameIri,
        setGraphNameIri,
        timeOutVal,
        setTimeoutVal,
        format,
        setFormat,
        responseWindowFormat,
        setResponseWindowFormat,
        // currentlyChosenOlderQuery,
        // setCurrentlyChosenOlderQuery,
        saveCheckBoxVal,
        // setSaveCheckboxVal,
        queryNameVal,
        setQueryNameVal,
        previewType,
        setPreviewType,
        theme,
        setTheme,
        responseWindowHeight,
        setResponseWindowHeight,
        currentMarker,
        setCurrentMarker,
        windowResponse,
        setWindowResponse,
        setWindowResponseTable,
        windowResponseTable,
        // createNewTab,
        privateModifierCheckBoxVal,
        // setPrivateModifierCheckBoxVal,
        localhostLoaded,
        triggerCodeMirrorStateChange,
        queryType,
        setQueryType,
        formatOptions,
        // queryId,
        isPublic,
    } = useTabConfig;

    const dispatch = useDispatch();

    // const authState = useSelector(state => state.auth);
    const queryState = useSelector(state => state.query);
    const queryStateHTML = useSelector(state => state.queryHTML);
    // const allQueries = useSelector(state => state.allQueries);
    const savedQueryResult = useSelector(state => state.savedQueryResult);

    const codeMirrorRef = useRef(null);
    const codeMirrorRef2 = useRef(null);

    const [completed, setCompleted] = useState(0);
    // const [loggedIn, setLoggedIn] = useState(tokenHelper.auth());

    useInterval(
        () => {
            setCompleted(oldCompleted => {
                let diff;
                if (oldCompleted < 75) {
                    diff = Math.random() * 20;
                } else {
                    diff = Math.random() * 2;
                }

                return Math.min(oldCompleted + diff, 100);
            });
        },
        stateIsLoading(queryState) ? 400 : null
    );

    useEffect(() => {
        if (stateIsLoaded(queryState)) {
            setCompleted(100);
            setTimeout(() => {
                setCompleted(0);
            }, 300);
        }
    }, [queryState]);

    const formatToCodeMirrorMode = {
        'application/json': 'javascript',
        'text/html': 'xml',
        'text/turtle': 'turtle',
        'application/xml': 'xml',
        'application/rdf+xml': 'xml',
        'application/n-triples': 'ntriples',
        'text/csv': 'csv',
        'text/tab-separated-values': 'tsv',
    };

    // const savedQueryOptions = allQueries.data.data
    //     ? allQueries?.data?.data.userQueries.map(el => {
    //           return { name: el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : ''), value: el };
    //       })
    //     : [];

    useEffect(() => {
        if (codeMirrorRef.current) {
            // codeMirrorRef.current.codeMirror.setValue(currentlyChosenOlderQuery.queryString);
            codeMirrorRef.current.codeMirror.setValue(sparqlQueryVal);
            validator(sparqlQueryVal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab, localhostLoaded, triggerCodeMirrorStateChange]);

    useEffect(() => {
        if (stateIsLoaded(queryState)) {
            setWindowResponse(setupDataForResponseWindow(queryState?.data?.data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryState]);

    useEffect(() => {
        if (stateIsLoaded(savedQueryResult)) {
            setWindowResponse(setupDataForResponseWindow(savedQueryResult?.data?.data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedQueryResult]);

    useEffect(() => {
        if (codeMirrorRef2.current) {
            try {
                console.log(windowResponse);
                codeMirrorRef2.current.codeMirror.setValue(windowResponse);
            } catch (e) {
                console.log(e);
            }
        }
    }, [windowResponse]);

    useEffect(() => {
        if (stateIsLoaded(queryStateHTML)) {
            setWindowResponseTable(queryStateHTML?.data?.data);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryStateHTML]);

    // useEffect(() => {
    //     if (codeMirrorRef2.current) {
    //         try {
    //             codeMirrorRef2.current.codeMirror.setValue(windowResponse);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }
    // }, [windowResponse]);

    function setupDataForResponseWindow(data) {
        switch (format) {
            case 'application/json':
                return JSON.stringify(data, null, ' ');

            default:
                return data;
        }
    }

    function makeMarker(msg) {
        const marker = document.createElement('div');
        marker.classList.add('error-marker');
        marker.innerHTML = '&nbsp;';

        const error = document.createElement('div');
        error.innerHTML = msg;
        error.classList.add('error-message');
        marker.appendChild(error);

        return marker;
    }

    function onResponseWindowResize(data) {
        setResponseWindowHeight(data.size.height);
    }

    function validator(data) {
        if (currentMarker) {
            currentMarker.clear();
        }
        if (codeMirrorRef.current) {
            codeMirrorRef.current.codeMirror.clearGutter('error');
        }
        try {
            let parsed = parser.parse(data);

            setQueryType(parsed.queryType.toLowerCase());
        } catch (e) {
            let splitted = e?.message?.split(/\r?\n/);
            if (splitted.length === 4) {
                let splitFirstLine = splitted[0]?.split(' ');
                if (!splitFirstLine) {
                    return;
                }
                let lineNumber = splitFirstLine[splitFirstLine.length - 1];
                lineNumber = lineNumber.substring(0, lineNumber.length - 1);
                let mistakeStart = splitted[2].length;
                let incorrectnessStart = splitted[1].replace('...', '');
                let message = splitted[3];
                codeMirrorRef.current.codeMirror.setGutterMarker(+lineNumber - 1, 'error', makeMarker(message));
                let codeMirror = codeMirrorRef.current.codeMirror;
                let lineTokens = codeMirror.getLineTokens(+lineNumber - 1);
                let prevInputSize = 0;

                for (let i = 0; i < +lineNumber - 1; i++) {
                    prevInputSize += codeMirror.lineInfo(i).text.length;
                }
                let indexOfStartString = data.replace(/\n/g, '').indexOf(incorrectnessStart);
                indexOfStartString = indexOfStartString - prevInputSize + (mistakeStart > 20 ? mistakeStart - 4 : mistakeStart - 1);
                let errorChars = {};

                lineTokens.forEach(({ start, end }) => {
                    if (start <= indexOfStartString && end > indexOfStartString) {
                        errorChars = { start: indexOfStartString, end: end };
                    }
                });

                let marker = codeMirror
                    .getDoc()
                    .markText(
                        { line: lineNumber - 1, ch: errorChars.start },
                        { line: lineNumber - 1, ch: errorChars.end },
                        { className: 'syntax_error' }
                    );

                setCurrentMarker(marker);
            }
        }
    }

    return (
        <View style={{ flex: 1, ...style }}>
            <View style={{ flexDirection: 'row', paddingLeft: 42, paddingRight: 30 }}>
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 20 }}>
                        <CustomInput
                            maxSize={130}
                            style={{ paddingRight: 20 }}
                            label={'Query name'}
                            value={queryNameVal}
                            setValue={setQueryNameVal}
                        ></CustomInput>
                        <CustomInput
                            label={'Query url from'}
                            style={{ width: '30%', paddingRight: 20 }}
                            value={url}
                            setValue={setUrl}
                            maxSize={400}
                        ></CustomInput>

                        <CustomizedSelects
                            label={'Format'}
                            options={formatOptions[queryType]}
                            currentOption={format}
                            setCurrentOption={setFormat}
                        ></CustomizedSelects>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CustomInput
                            label={'Timeout'}
                            style={{ paddingRight: 20 }}
                            maxSize={130}
                            value={timeOutVal}
                            setValue={setTimeoutVal}
                            type={'number'}
                        ></CustomInput>
                        <CustomInput
                            label={'Default Data Set Name (Graph IRI)'}
                            style={{ width: '30%', paddingRight: 20 }}
                            value={graphNameIri}
                            setValue={setGraphNameIri}
                            maxSize={400}
                        ></CustomInput>
                        {isPublic && (
                            <CustomInput
                                label={'Public query link'}
                                style={{ width: '30%', paddingRight: 20 }}
                                value={window.location}
                                // setValue={'/sparql?queryId=' + queryId}
                                maxSize={400}
                                disabled={true}
                                endIcon={
                                    <CopyToClipboard text={`${window.location}`}>
                                        <FileCopyIcon
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                alert('Link was copied to clipboard');
                                            }}
                                            color="secondary"
                                        ></FileCopyIcon>
                                    </CopyToClipboard>
                                }
                            ></CustomInput>
                        )}
                    </View>

                    {/* <TextareaAutosize
                        hidden
                        name={'queryStr'}
                        form={'someform'}
                        value={sparqlQueryVal}
                        style={{ width: '100%' }}
                        onChange={event => {
                            setSparqlQueryVal(event.target.value);
                        }}
                        aria-label="minimum height"
                        rowsMin={10}
                        placeholder="Minimum 3 rows"
                    /> */}

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <CustomizedSelects
                            label={'Theme'}
                            options={[
                                { name: 'default', value: 'default' },
                                ...themes.map(el => {
                                    return {
                                        name: el,
                                        value: el,
                                    };
                                }),
                            ]}
                            currentOption={theme}
                            setCurrentOption={setTheme}
                        ></CustomizedSelects>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<PlayArrowIcon fontSize={'large'} />}
                            style={{ marginLeft: 20 }}
                            onClick={() => {
                                // eve.preventDefault();
                                if (!stateIsLoading(queryState)) {
                                    dispatch(processQuery(url, graphNameIri, sparqlQueryVal, format, timeOutVal, queryType));
                                    if (queryType === 'select') {
                                        dispatch(processQueryJSON(url, graphNameIri, sparqlQueryVal, timeOutVal, queryType));
                                    }
                                    setResponseWindowFormat(formatToCodeMirrorMode[format]);
                                    if (saveCheckBoxVal) {
                                        dispatch(
                                            saveQueryAction(
                                                url,
                                                graphNameIri,
                                                sparqlQueryVal,
                                                format,
                                                timeOutVal,
                                                queryNameVal,
                                                privateModifierCheckBoxVal,
                                                queryType
                                            )
                                        );
                                        // dispatch(getAllQueriesAction());
                                    }
                                }
                            }}
                        >
                            run query
                        </Button>
                    </View>
                </View>
            </View>
            {/* </form> */}

            <ResizableBox
                className="custom-box box"
                width={'100%'}
                height={300}
                style={{ border: '1px solid #DDDDDD', marginRight: 20 }}
                handleSize={[8, 8]}
                resizeHandles={['s']}
                handle={
                    <div
                        style={{
                            width: '25%',
                            height: 5,
                            marginTop: 5,
                            background: '#C6C6C6',
                            cursor: 'row-resize',
                            marginLeft: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    ></div>
                }
            >
                <CodeMirror
                    className={'code-editor'}
                    ref={codeMirrorRef}
                    style={{ height: 200 }}
                    value={sparqlQueryVal}
                    lint={true}
                    onChange={data => {
                        setSparqlQueryVal(data);
                        validator(data);
                    }}
                    options={{
                        lineNumbers: true,
                        mode: 'sparql',
                        lint: true,
                        theme: theme,
                        gutters: ['error', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                        foldGutter: true,
                        lineWrapping: true,
                        // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                    }}
                />
            </ResizableBox>
            <View style={{ marginTop: 20, borderBottom: `1px solid ${colors.borderGrayColor()}` }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button
                        style={{ borderBottom: previewType === 'response' ? '2px solid orange' : null, borderRadius: 0 }}
                        startIcon={<ListAltIcon color={previewType === 'response' ? 'primary' : 'secondary'}></ListAltIcon>}
                        onClick={() => {
                            setPreviewType('response');
                        }}
                    >
                        Response Preview
                    </Button>
                    <Button
                        style={{ borderBottom: previewType === 'table' ? '2px solid orange' : null, borderRadius: 0 }}
                        startIcon={<TableChartIcon color={previewType === 'table' ? 'primary' : 'secondary'}></TableChartIcon>}
                        onClick={() => {
                            setPreviewType('table');
                        }}
                    >
                        Table
                    </Button>
                    <View style={{ flex: 1 }}></View>
                    {/* <button */}
                    <GetAppIcon
                        color={'secondary'}
                        style={{ cursor: 'pointer', marginRight: 35 }}
                        fontSize={'large'}
                        onClick={() => {
                            if (format !== 'application/json') {
                                var blob = new Blob([queryState.data.data], { type: `${format};charset=utf-8` });
                            } else {
                                var blob = new Blob([JSON.stringify(queryState.data.data)], { type: `${format};charset=utf-8` });
                            }

                            FileSaver.saveAs(blob, queryNameVal);
                        }}
                    ></GetAppIcon>

                    {/* </button> */}
                </View>
            </View>
            <View style={{ paddingTop: 20, marginRight: 20 }}>
                {completed > 0 && <LinearProgress value={completed} variant="determinate" color="primary" />}
                {previewType === 'response' && (
                    <ResizableBox
                        className="custom-box box"
                        // width={100}
                        height={responseWindowHeight}
                        style={{ border: '1px solid #DDDDDD', marginBottom: 100 }}
                        handleSize={[8, 8]}
                        resizeHandles={['s']}
                        onResize={(ev, data) => {
                            onResponseWindowResize(data);
                        }}
                        handle={
                            <div
                                style={{
                                    width: '25%',
                                    height: 5,
                                    marginTop: 5,
                                    background: '#C6C6C6',
                                    cursor: 'row-resize',
                                    marginLeft: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            ></div>
                        }
                    >
                        <CodeMirror
                            ref={codeMirrorRef2}
                            style={{ height: 250, width: '100%' }}
                            value={windowResponse}
                            lint={true}
                            // onChange={data => {}}
                            options={{
                                lineNumbers: true,
                                lint: true,
                                mode: responseWindowFormat,
                                theme: theme,
                                htmlMode: true,
                                lineWrapping: true,
                                readOnly: true,
                                gutters: ['error', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                                foldGutter: true,
                            }}
                        />
                    </ResizableBox>
                )}
                {previewType === 'table' && (
                    <>
                        {/* <ResizableBox
                            className="custom-box box"
                            height={responseWindowHeight}
                            // width={100}
                            style={{ borderBottom: '1px solid #DDDDDD', marginBottom: 100 }}
                            handleSize={[8, 8]}
                            resizeHandles={['s']}
                            onResize={(ev, data) => {
                                onResponseWindowResize(data);
                            }}
                            handle={
                                <div
                                    style={{
                                        width: '25%',
                                        height: 5,
                                        marginTop: 5,
                                        background: '#C6C6C6',
                                        cursor: 'row-resize',
                                        marginLeft: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                ></div>
                            }
                        > */}
                        {/* <View style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                                {windowResponseTable && htmlToReactParser.parse(windowResponseTable)}
                                {!windowResponseTable && (
                                    <View>
                                        <Text> Table view not available right now. Please run query to get table view. </Text>
                                    </View>
                                )}
                            </View> */}
                        {windowResponseTable?.head && (
                            <View style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                                <DataTable
                                    // responsive={true}
                                    noHeader={true}
                                    columns={windowResponseTable?.head?.vars.map(el => {
                                        return {
                                            name: el,
                                            selector: (row, index) => row[el].value,
                                            sortable: true,
                                        };
                                    })}
                                    data={windowResponseTable?.results?.bindings}
                                    pagination={true}
                                ></DataTable>
                            </View>
                        )}
                        {!windowResponseTable?.head && (
                            <View>
                                <Text>
                                    {' '}
                                    Table view not available right now. Table view is only available on select queries. Please run query to get table
                                    view.{' '}
                                </Text>
                            </View>
                        )}
                        {/* </ResizableBox> */}
                    </>
                )}
            </View>
        </View>
    );
}
