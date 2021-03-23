import { Button, FormControl, Input, OutlinedInput, TextareaAutosize, TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { basicStyles } from 'styles';
import { InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { processQuery } from 'redux/actions/data.actions';
import { logoutAction } from 'redux/actions/auth.actions';

import { themes } from 'static';
import './Editor.css';
import { Resizable, ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import View from 'module/components/View';
import Text from 'module/components/Text';
import { tokenHelper } from 'services/tokenHelpers';

var CodeMirror = require('react-codemirror');
// import { UnControlled as CodeMirror } from 'react-codemirror2';

// var ErrorStackParser = require('error-stack-parser');

require('codemirror/lib/codemirror.css');

themes.forEach(theme => {
    // console.log(theme);
    require(`codemirror/theme/${theme}.css`);
});

require('codemirror/mode/sparql/sparql');
require('codemirror/mode/javascript/javascript');

const SparqlParser = require('sparqljs').Parser;
const parser = new SparqlParser();

export default function Editor({ history }) {
    const dispatch = useDispatch();
    const [sparqlQueryVal, setSparqlQueryVal] = useState(`select distinct ?Concept where {[] a ?Concept} LIMIT 10`);
    const [url, setUrl] = useState(`http://dbpedia.org/sparql`);
    const [graphNameIri, setGraphNameIri] = useState(`http://dbpedia.org`);
    const [timeOutVal, setTimeoutVal] = useState(30000);
    const authState = useSelector(state => state.auth);
    const [loggedIn, setLoggedIn] = useState(tokenHelper.auth());

    useEffect(() => {
        console.log('it execs');
        setLoggedIn(tokenHelper.auth());
    }, [authState]);

    const [theme, setTheme] = useState(`default`);
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(200);
    const [editor, setEditor] = useState(null);
    const [currentMarker, setCurrentMarker] = useState(null);
    const codeMirrorRef = useRef(null);
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

    function validator(data) {
        if (currentMarker) {
            currentMarker.clear();
        }
        if (codeMirrorRef.current) {
            codeMirrorRef.current.codeMirror.clearGutter('error');
        }
        try {
            var parsedQuery = parser.parse(data);

            // var parsedQuery = parser.parse(data);
        } catch (e) {
            console.log(e.message);
            let splitted = e.message.split(/\r?\n/);
            console.log(splitted);
            if (splitted.length === 4) {
                let splitFirstLine = splitted[0].split(' ');
                let lineNumber = splitFirstLine[splitFirstLine.length - 1];
                lineNumber = lineNumber.substring(0, lineNumber.length - 1);
                console.log('line number is', lineNumber);
                let mistakeStart = splitted[2].length - 1;
                let incorrectness = splitted[1].substring(mistakeStart, splitted[1].length - 1);

                // let relativeCharStartIndex = mistakeStart;
                // if (incorrectness.contains('...')) {
                //     relativeCharStartIndex = relativeCharStartIndex - 3;
                // }
                incorrectness.replace('...', '');
                incorrectness = incorrectness.substring(0, 5);
                incorrectness = incorrectness.trim();

                console.log('1' + incorrectness + '1');
                let message = splitted[3];

                codeMirrorRef.current.codeMirror.setGutterMarker(+lineNumber - 1, 'error', makeMarker(message));
                console.log();

                let codeMirror = codeMirrorRef.current.codeMirror;

                // console.log("relativeCharStartIndex", relativeCharStartIndex)

                let lineTokens = codeMirror.getLineTokens(+lineNumber - 1);
                // console.log(codeMirror.lineInfo(lineNumber - 1));

                let fullLineText = codeMirror.lineInfo(+lineNumber - 1).text;

                console.log(fullLineText);

                let indexOfStartString = fullLineText.indexOf(incorrectness);

                console.log('error starts at', indexOfStartString);

                console.log(lineTokens);

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
                console.log(marker);

                setCurrentMarker(marker);
            }
        }
    }

    return (
        <View style={{ ...basicStyles.paddingContainer, flex: 1 }}>
            <Text> SPARQL Editor </Text>
            {loggedIn && (
                <View>
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
                <View>
                    <Button
                        onClick={() => {
                            // dispatch(lo);
                            history.replace('/login');
                        }}
                    >
                        Login
                    </Button>
                </View>
            )}
            {/* <FormControl style={{ flex: 1 }}> */}
            <form action="http://localhost:8080/sparql" id="someform" method={'POST'}>
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
                <select name="format" form="someform">
                    <option value="application/json">json</option>
                    <option value="application/html">html</option>
                    <option value="text/turtle">turtle</option>
                    <option value="application/xml">xml</option>
                    <option value="application/rdf+xml">rdf/xml</option>
                    <option value="application/n-triples">N-triples</option>
                    <option value="text/csv">csv</option>
                    <option value="text/tab-separated-values">tsv</option>
                </select>
                <input type="submit" />
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
                    ref={codeMirrorRef}
                    onRenderLine={(editor, lineHandle, element) => {
                        console.log(element);
                    }}
                    // editorDidMount={editorRef => {
                    //     setEditor(editorRef);
                    // }}
                    // codeMirrorInstance={editorInstance => {
                    //     setEditor(editorInstance);
                    // }}

                    style={{ height: 250 }}
                    value={sparqlQueryVal}
                    lint={true}
                    onChange={data => {
                        console.log(data);
                        // let dataSplit = data.split(/\r?\n/);
                        // let newData = '';
                        // for (let i = 0; i < dataSplit.length; i++) {
                        //     newData += dataSplit[i] + '\n';
                        // }
                        setSparqlQueryVal(data);
                        validator(data);
                    }}
                    // onChange={(editor, data, value) => {
                    //     // setSparqlQueryVal();
                    //     // console.log(event);
                    //     setSparqlQueryVal(value);
                    // }}
                    options={{
                        lineNumbers: true,
                        lint: true,
                        mode: 'sparql',
                        theme: theme,
                        gutters: ['error'],
                    }}
                />
            </ResizableBox>

            <div style={{ marginTop: 20 }}>
                <select
                    onChange={event => {
                        console.log(event.target.value);
                        // let path = 'codemirror/theme/' + event.target.value + '.css';
                        // require(path);
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
            {/* <button
                onClick={() => {
                    validator();
                }}
            >
                {' '}
                validate{' '}
            </button> */}

            {/* <InputLabel> Default Data Set Name (Graph IRI)</InputLabel>
            <OutlinedInput />

            <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    console.log('clicking');
                    dispatch(processQuery(url, sparqlQueryVal));
                }}
            >
                Submit
            </Button> */}
            {/* </FormControl> */}
        </View>
    );
}
