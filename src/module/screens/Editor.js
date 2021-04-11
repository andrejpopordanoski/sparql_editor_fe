import { Button, Checkbox, FormControl, Input, makeStyles, OutlinedInput, TextareaAutosize, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { basicStyles, colors, headers } from 'styles';
import { InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getAllQueriesAction, getSavedQueryResultAction, processQuery, processQueryHTML, saveQueryAction } from 'redux/actions/data.actions';
import { logoutAction } from 'redux/actions/auth.actions';

import { themes } from 'static';
import './Editor.css';
import { Resizable, ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import View from 'module/components/View';
import Text from 'module/components/Text';
import { tokenHelper } from 'services/tokenHelpers';
import { stateIsLoaded } from 'services/stateHelpers';
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
import { validateEmail } from 'services/stringHelpers';
import CustomInput from 'module/components/CustomInput';
import NumericInput from 'material-ui-numeric-input';
import CustomizedSelects from 'module/components/CustomSelect';
// import playIcon from 'assets/icons/play.png';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ResizableBoxHandle from 'module/components/ResizableBoxHandle';
import GetAppIcon from '@material-ui/icons/GetApp';
import TableChartIcon from '@material-ui/icons/TableChart';
import ListAltIcon from '@material-ui/icons/ListAlt';
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

// const useStyles = makeStyles(theme => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//     },
//     margin: {
//         margin: theme.spacing(1),
//     },
// }));
export default function Editor({ history, style, currentTab, index, useTabConfig }) {
    // const classes = useStyles();
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
        currentlyChosenOlderQuery,
        setCurrentlyChosenOlderQuery,
        checkboxVal,
        setCheckboxVal,
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
        createNewTab,
    } = useTabConfig;

    const formatOptions = [
        {
            name: 'Json',
            value: 'application/json',
        },
        {
            name: 'HTML',
            value: 'text/html',
        },
        {
            name: 'Turtle',
            value: 'text/turtle',
        },
        {
            name: 'XML',
            value: 'application/xml',
        },
        {
            name: 'RDF/XML',
            value: 'application/rdf+xml',
        },
        {
            name: 'N-triples',
            value: 'application/n-triples',
        },
        {
            name: 'CSV',
            value: 'text/csv',
        },
        {
            name: 'TSV',
            value: 'text/tab-separated-values',
        },
    ];

    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const queryState = useSelector(state => state.query);
    const queryStateHTML = useSelector(state => state.queryHTML);
    const allQueries = useSelector(state => state.allQueries);
    const savedQueryResult = useSelector(state => state.savedQueryResult);

    const codeMirrorRef = useRef(null);
    const codeMirrorRef2 = useRef(null);
    let loggedIn = tokenHelper.auth();

    // const [loggedIn, setLoggedIn] = useState(tokenHelper.auth());

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

    const savedQueryOptions = allQueries.data.data
        ? allQueries?.data?.data.map(el => {
              return { name: el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : ''), value: el };
          })
        : [];

    // useEffect(() => {
    //     console.log(tokenHelper.auth());
    //     setLoggedIn(tokenHelper.auth());
    // }, [authState]);

    // useEffect(() => {
    //     if (currentlyChosenOlderQuery) {
    //         // setSparqlQueryVal(currentlyChosenOlderQuery.queryString);

    //         // setUrl(currentlyChosenOlderQuery.url);
    //         // if (codeMirrorRef.current) {
    //         //     codeMirrorRef.current.codeMirror.setValue(currentlyChosenOlderQuery.queryString);
    //         //     // codeMirrorRef.current.codeMirror.setValue(sparqlQueryVal);
    //         // }

    //         // setGraphNameIri(currentlyChosenOlderQuery.defaultDatasetName);

    //         // setTimeoutVal(currentlyChosenOlderQuery.timeout);

    //         // setFormat(currentlyChosenOlderQuery.format);
    //         let newTab = {
    //             sparqlQueryVal: currentlyChosenOlderQuery.queryString,
    //             url: currentlyChosenOlderQuery.url,
    //             graphNameIri: currentlyChosenOlderQuery.defaultDatasetName,
    //             timeout: currentlyChosenOlderQuery.timeout,
    //             format: currentlyChosenOlderQuery.format,
    //         };
    //         createNewTab(newTab);
    //     }
    // }, [currentlyChosenOlderQuery]);

    // useEffect(() => {
    //     if (codeMirrorRef2.current) {
    //         codeMirrorRef2.current.codeMirror.setValue(queryState?.data?.data);
    //     }
    // }, [queryState]);

    useEffect(() => {
        if (codeMirrorRef.current) {
            // codeMirrorRef.current.codeMirror.setValue(currentlyChosenOlderQuery.queryString);
            codeMirrorRef.current.codeMirror.setValue(sparqlQueryVal);
            validator(sparqlQueryVal);
        }
    }, [currentTab]);

    useEffect(() => {
        if (stateIsLoaded(queryState)) {
            setWindowResponse(setupDataForResponseWindow(queryState?.data?.data));
        }
    }, [queryState]);

    useEffect(() => {
        if (stateIsLoaded(savedQueryResult)) {
            setWindowResponse(setupDataForResponseWindow(savedQueryResult?.data?.data));
        }
    }, [savedQueryResult]);

    useEffect(() => {
        if (codeMirrorRef2.current) {
            codeMirrorRef2.current.codeMirror.setValue(windowResponse);
        }
    }, [windowResponse]);

    useEffect(() => {
        if (stateIsLoaded(queryStateHTML)) {
            setWindowResponseTable(queryStateHTML?.data?.data);
        }
    }, [queryStateHTML]);

    useEffect(() => {
        if (codeMirrorRef2.current) {
            codeMirrorRef2.current.codeMirror.setValue(windowResponse);
        }
    }, [windowResponse]);

    function setupDataForResponseWindow(data) {
        switch (format) {
            case 'application/json':
                return JSON.stringify(data, null, ' ');
            // case 'text/html':
            //     return JSON.stringify(data, 4, ' ');
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
            parser.parse(data);
        } catch (e) {
            let splitted = e.message.split(/\r?\n/);
            if (splitted.length === 4) {
                let splitFirstLine = splitted[0].split(' ');
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
                            options={formatOptions}
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
                    </View>

                    <TextareaAutosize
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
                    />

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
                                dispatch(processQuery(url, graphNameIri, sparqlQueryVal, format, timeOutVal));
                                dispatch(processQueryHTML(url, graphNameIri, sparqlQueryVal, timeOutVal));
                                setResponseWindowFormat(formatToCodeMirrorMode[format]);
                                if (checkboxVal) {
                                    dispatch(saveQueryAction(url, graphNameIri, sparqlQueryVal, format, timeOutVal, queryNameVal));
                                    // dispatch(getAllQueriesAction());
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
                            if (format != 'application/json') {
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
                            onChange={data => {}}
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
                        <ResizableBox
                            className="custom-box box"
                            height={responseWindowHeight}
                            // width={100}
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
                            <View style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                                {windowResponseTable && htmlToReactParser.parse(windowResponseTable)}
                            </View>
                        </ResizableBox>
                    </>
                )}
            </View>
        </View>
    );
}
