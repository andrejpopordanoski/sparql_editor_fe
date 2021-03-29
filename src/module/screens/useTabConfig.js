import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { tokenHelper } from 'services/tokenHelpers';

export const useTabConfig = () => {
    const defaultNewTab = {
        sparqlQueryVal: `select distinct ?Concept where {[] a ?Concept} LIMIT 10`,
        url: `http://dbpedia.org/sparql`,
        graphNameIri: `http://dbpedia.org`,
        timeOutVal: 30000,
        format: 'application/json',
        responseWindowFormat: 'javascript',
        currentlyChosenOlderQuery: null,
        checkboxVal: false,
        queryNameVal: 'Untitled',
        previewType: 'response',
        theme: 'default',
        responseWindowHeight: 200,
        currentMarker: null,
    };
    // const [tabs, setTabs] = useState([defaultNewTab]);

    const [sparqlQueryVal, setSparqlQueryVal] = useState(defaultNewTab.sparqlQueryVal);
    const [url, setUrl] = useState(defaultNewTab.url);
    const [graphNameIri, setGraphNameIri] = useState(defaultNewTab.graphNameIri);
    const [timeOutVal, setTimeoutVal] = useState(defaultNewTab.timeOutVal);
    const [format, setFormat] = useState(defaultNewTab.format);
    const [responseWindowFormat, setResponseWindowFormat] = useState(defaultNewTab.responseWindowFormat);
    const [currentlyChosenOlderQuery, setCurrentlyChosenOlderQuery] = useState(defaultNewTab.currentlyChosenOlderQuery);
    const [checkboxVal, setCheckboxVal] = useState(defaultNewTab.checkboxVal);
    const [queryNameVal, setQueryNameVal] = useState(defaultNewTab.queryNameVal);
    const [previewType, setPreviewType] = useState(defaultNewTab.previewType);
    const [theme, setTheme] = useState(defaultNewTab.theme);
    const [responseWindowHeight, setResponseWindowHeight] = useState(defaultNewTab.responseWindowHeight);
    const [currentMarker, setCurrentMarker] = useState(defaultNewTab.currentMarker);
    const [responseWindowResponse, setResponseWindowResponse] = useState('');
    const [responseWindowResponseTable, setResponseWindowResponseTable] = useState('');

    // const [currentTab, setCurrentTab] = useState(0);

    // useEffect(() => {
    //     tabs[currentTab] = {
    //         ...tabs[currentTab],
    //         sparqlQueryVal: sparqlQueryVal,
    //     };
    //     console.log(tabs);
    //     setTabs([...tabs]);
    // }, [sparqlQueryVal]);

    // useEffect(() => {
    //     tabs[currentTab] = {
    //         ...tabs[currentTab],
    //         url: url,
    //     };
    //     setTabs([...tabs]);
    // }, [url]);

    // useEffect(() => {
    //     tabs[currentTab] = {
    //         ...tabs[currentTab],
    //         graphNameIri: graphNameIri,
    //     };
    //     setTabs([...tabs]);
    // }, [graphNameIri]);

    // useEffect(() => {
    //     tabs[currentTab] = {
    //         ...tabs[currentTab],
    //         timeOutVal: timeOutVal,
    //     };
    //     setTabs([...tabs]);
    // }, [timeOutVal]);

    // useEffect(() => {
    //     tabs[currentTab] = {
    //         ...tabs[currentTab],
    //         format: format,
    //     };
    //     setTabs([...tabs]);
    // }, [format]);

    // // useEffect(() => {
    // //     let tabChanged = {
    // //         sparqlQueryVal: sparqlQueryVal,
    // //         url: url,
    // //         graphNameIri: graphNameIri,
    // //         timeOutVal: timeOutVal,
    // //         format: format,
    // //         responseWindowFormat: responseWindowFormat,
    // //         currentlyChosenOlderQuery: currentlyChosenOlderQuery,
    // //         checkboxVal: checkboxVal,
    // //         queryNameVal: queryNameVal,
    // //         previewType: previewType,
    // //         theme: theme,
    // //         responseWindowHeight: responseWindowHeight,
    // //         currentMarker: currentMarker,
    // //     };
    // //     tabs[currentTab] = tabChanged;
    // //     console.log(tabs, currentTab);
    // //     setTabs([...tabs]);
    // // }, [
    // //     sparqlQueryVal,
    // //     url,
    // //     graphNameIri,
    // //     timeOutVal,
    // //     format,
    // //     responseWindowFormat,
    // //     currentlyChosenOlderQuery,
    // //     checkboxVal,
    // //     queryNameVal,
    // //     previewType,
    // //     theme,
    // //     responseWindowHeight,
    // //     currentMarker,
    // // ]);

    // useEffect(() => {
    //     // console.log(tabs[currentTab]?.sparqlQueryVal || defaultNewTab.sparqlQueryVal);
    //     setSparqlQueryVal(tabs[currentTab]?.sparqlQueryVal || defaultNewTab.sparqlQueryVal);
    //     setUrl(tabs[currentTab]?.url || defaultNewTab.url);
    //     setGraphNameIri(tabs[currentTab]?.graphNameIri || defaultNewTab.graphNameIri);
    //     setTimeoutVal(tabs[currentTab]?.timeOutVal || defaultNewTab.timeOutVal);
    //     setFormat(tabs[currentTab]?.format || defaultNewTab.format);
    //     setResponseWindowFormat(tabs[currentTab]?.responseWindowFormat || defaultNewTab.responseWindowFormat);
    //     setCurrentlyChosenOlderQuery(tabs[currentTab]?.currentlyChosenOlderQuery || defaultNewTab.currentlyChosenOlderQuery);
    //     setQueryNameVal(tabs[currentTab]?.queryNameVal || defaultNewTab.queryNameVal);
    //     setPreviewType(tabs[currentTab]?.previewType || defaultNewTab.previewType);
    //     setTheme(tabs[currentTab]?.theme || defaultNewTab.theme);
    //     setResponseWindowHeight(tabs[currentTab]?.responseWindowHeight || defaultNewTab.responseWindowHeight);
    //     setCurrentMarker(tabs[currentTab]?.currentMarker || defaultNewTab.currentMarker);
    // }, [currentTab]);

    // useEffect(() => {
    //     console.log('sth moved');
    // });

    return {
        sparqlQueryVal: sparqlQueryVal,
        setSparqlQueryVal: setSparqlQueryVal,
        url: url,
        setUrl: setUrl,
        graphNameIri: graphNameIri,
        setGraphNameIri: setGraphNameIri,
        timeOutVal: timeOutVal,
        setTimeoutVal: setTimeoutVal,
        format: format,
        setFormat: setFormat,
        responseWindowFormat: responseWindowFormat,
        setResponseWindowFormat: setResponseWindowFormat,
        currentlyChosenOlderQuery: currentlyChosenOlderQuery,
        setCurrentlyChosenOlderQuery: setCurrentlyChosenOlderQuery,
        checkboxVal: checkboxVal,
        setCheckboxVal: setCheckboxVal,
        queryNameVal: queryNameVal,
        setQueryNameVal: setQueryNameVal,
        previewType: previewType,
        setPreviewType: setPreviewType,
        theme: theme,
        setTheme: setTheme,
        responseWindowHeight: responseWindowHeight,
        setResponseWindowHeight: setResponseWindowHeight,
        currentMarker: currentMarker,
        setCurrentMarker: setCurrentMarker,
        responseWindowResponse: responseWindowResponse,
        setResponseWindowResponse: setResponseWindowResponse,
        setResponseWindowResponseTable: setResponseWindowResponseTable,
        responseWindowResponseTable: responseWindowResponseTable,
        // currentTab: currentTab,
        // setCurrentTab: setCurrentTab,
    };
};
