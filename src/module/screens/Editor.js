import { Button, FormControl, Input, OutlinedInput, TextareaAutosize, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { basicStyles } from 'styles';
import { InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { processQuery, processQueryHTML, saveQueryAction } from 'redux/actions/data.actions';
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

export default function Editor({ history }) {
    const dispatch = useDispatch();
    const [sparqlQueryVal, setSparqlQueryVal] = useState(`select distinct ?Concept where {[] a ?Concept} LIMIT 10`);
    const [url, setUrl] = useState(`http://dbpedia.org/sparql`);
    const [graphNameIri, setGraphNameIri] = useState(`http://dbpedia.org`);
    const [timeOutVal, setTimeoutVal] = useState(30000);
    const [format, setFormat] = useState('application/json');
    const [responseWindowFormat, setResponseWindowFormat] = useState('javascript');

    const [checkboxVal, setCheckboxVal] = useState(false);
    const [queryNameVal, setQueryNameVal] = useState('Untitled');
    const [previewType, setPreviewType] = useState('response');

    const authState = useSelector(state => state.auth);
    const queryState = useSelector(state => state.query);
    const queryStateHTML = useSelector(state => state.queryHTML);

    const [theme, setTheme] = useState(`default`);
    const [width, setWidth] = useState(200);
    const [responseWindowHeight, setResponseWindowHeight] = useState(200);
    const [editor, setEditor] = useState(null);
    const [currentMarker, setCurrentMarker] = useState(null);
    const codeMirrorRef = useRef(null);
    const codeMirrorRef2 = useRef(null);

    const [loggedIn, setLoggedIn] = useState(tokenHelper.auth());

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

    useEffect(() => {
        // console.log('it execs');
        setLoggedIn(tokenHelper.auth());
    }, [authState]);

    useEffect(() => {
        // console.log('it execs');
        // setLoggedIn(tokenHelper.auth());
        console.log(queryState);
        if (stateIsLoaded(queryState)) {
            // codeMirrorRef2.current.codeMirror.setValue(queryState?.data?.data);
            if (codeMirrorRef2.current) {
                codeMirrorRef2.current.codeMirror.setValue(setupDataForResponseWindow(queryState?.data?.data));
            }
            console.log(queryState?.data?.data);
        }
    }, [queryState]);

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
        console.log('maker called');
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
            // console.log(e.message);
            let splitted = e.message.split(/\r?\n/);
            // console.log(splitted);
            if (splitted.length === 4) {
                let splitFirstLine = splitted[0].split(' ');
                let lineNumber = splitFirstLine[splitFirstLine.length - 1];
                lineNumber = lineNumber.substring(0, lineNumber.length - 1);
                // console.log('line number is', lineNumber);
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
        <View style={{ ...basicStyles.paddingContainer, flex: 1 }}>
            <Text> SPARQL Editor </Text>
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
            {/* <FormControl style={{ flex: 1 }}> */}
            <form
                action={encodeURI(`http://localhost:8080/sparql`)}
                id="someform"
                method={'GET'}
                target="blank"
                onSubmit={eve => {
                    eve.preventDefault();
                    dispatch(processQuery(url, graphNameIri, sparqlQueryVal, format, timeOutVal));
                    dispatch(processQueryHTML(url, graphNameIri, sparqlQueryVal, timeOutVal));
                    setResponseWindowFormat(formatToCodeMirrorMode[format]);
                }}
            >
                Url:{' '}
                <input
                    type="text"
                    name="url"
                    value={url}
                    onChange={event => {
                        setUrl(event.target.value);
                    }}
                />
                Default graph set iri:{' '}
                <input
                    type="text"
                    name="defaultGraphSetIri"
                    value={graphNameIri}
                    onChange={event => {
                        setGraphNameIri(event.target.value);
                    }}
                />
                Timeout:{' '}
                <input
                    type="number"
                    name="timeout"
                    value={timeOutVal}
                    onChange={event => {
                        setTimeoutVal(event.target.value);
                    }}
                />
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
                <select
                    name="format"
                    form="someform"
                    onChange={(event, value) => {
                        console.log(event.target.value);
                        setFormat(event.target.value);
                    }}
                >
                    <option value="application/json">json</option>
                    <option value="text/html">html</option>
                    <option value="text/turtle">turtle</option>
                    <option value="application/xml">xml</option>
                    <option value="application/rdf+xml">rdf/xml</option>
                    <option value="application/n-triples">N-triples</option>
                    <option value="text/csv">csv</option>
                    <option value="text/tab-separated-values">tsv</option>
                </select>
                <input
                    type="submit"
                    onClick={() => {
                        console.log('yes clicked');
                        if (checkboxVal) {
                            dispatch(saveQueryAction(url, graphNameIri, sparqlQueryVal, format, timeOutVal, queryNameVal));
                        }
                    }}
                />
                {loggedIn && (
                    <>
                        <input
                            type="text"
                            value={queryNameVal}
                            onChange={event => {
                                setQueryNameVal(event.target.value);
                            }}
                        />
                        <input
                            type="checkbox"
                            name="saveResults"
                            value={checkboxVal}
                            onChange={event => {
                                setCheckboxVal(event.target.checked);
                            }}
                        />
                    </>
                )}
            </form>

            <ResizableBox
                className="custom-box box"
                width={'100%'}
                height={200}
                style={{ border: '1px solid #DDDDDD' }}
                handleSize={[8, 8]}
                resizeHandles={['s']}
                handle={
                    <div
                        resizeHandle={'s'}
                        style={{
                            width: '25%',
                            height: 5,
                            marginTop: 5,
                            background: 'gray',
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
                    style={{ height: 250 }}
                    value={sparqlQueryVal}
                    lint={true}
                    onChange={data => {
                        setSparqlQueryVal(data);
                        validator(data);
                    }}
                    options={{
                        lineNumbers: true,
                        lint: true,
                        mode: 'sparql',
                        theme: theme,
                        gutters: ['error', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                        foldGutter: true,
                        lineWrapping: true,
                        // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
                    }}
                />
            </ResizableBox>
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        onClick={() => {
                            setPreviewType('response');
                        }}
                    >
                        Response Preview
                    </Button>
                    <Button
                        onClick={() => {
                            setPreviewType('table');
                        }}
                    >
                        Table
                    </Button>
                </View>
            </View>
            <View>
                {previewType === 'response' && (
                    <ResizableBox
                        className="custom-box box"
                        // width={100}
                        height={responseWindowHeight}
                        style={{ border: '1px solid #DDDDDD', marginTop: 20 }}
                        handleSize={[8, 8]}
                        resizeHandles={['s']}
                        onResize={(ev, data) => {
                            // console.log(data.size.height);
                            onResponseWindowResize(data);
                        }}
                        handle={
                            <div
                                style={{
                                    width: '25%',
                                    height: 5,
                                    marginTop: 5,
                                    background: 'gray',
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
                            value={setupDataForResponseWindow(queryState?.data?.data)}
                            lint={true}
                            onChange={data => {}}
                            options={{
                                lineNumbers: true,
                                lint: true,
                                mode: responseWindowFormat,
                                theme: theme,
                                htmlMode: true,
                                lineWrapping: true,

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
                            style={{ border: '1px solid #DDDDDD', marginTop: 20 }}
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
                                        background: 'gray',
                                        cursor: 'row-resize',
                                        marginLeft: '50%',
                                        transform: 'translateX(-50%)',
                                        marginBottom: 20,
                                    }}
                                ></div>
                            }
                        >
                            <View style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                                {queryStateHTML?.data?.data && htmlToReactParser.parse(queryStateHTML?.data?.data)}
                            </View>
                        </ResizableBox>
                    </>
                )}
            </View>

            <div style={{ marginTop: 20 }}>
                <select
                    onChange={event => {
                        setTheme(event.target.value);
                    }}
                    id="select"
                >
                    <option>default</option>
                    {themes.map(el => {
                        return <option> {el} </option>;
                    })}
                </select>
            </div>
            <button
                onClick={() => {
                    var blob = new Blob([queryState.data.data], { type: `${format};charset=utf-8` });
                    FileSaver.saveAs(blob, queryNameVal);
                }}
            >
                Download
            </button>
        </View>
    );
}
