import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { tokenHelper } from 'services/tokenHelpers';

export const useTabConfig = () => {
    const defaultNewTab = {
        sparqlQueryVal: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT * WHERE {
    ?sub ?pred ?obj .
} LIMIT 10`,
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
        responseWindowHeight: 250,
        currentMarker: null,
        windowResponse: '',
        tableResponse: '',
    };
    const [tabs, setTabs] = useState([defaultNewTab]);
    const [currentTab, setCurrentTab] = useState(0);
    const [tabsLabels, setTabsLabels] = useState(['Untitled']);

    // const [sparqlQueryVal, setSparqlQueryValState] = useState(defaultNewTab.sparqlQueryVal);
    // const [url, setUrlState] = useState(defaultNewTab.url);
    // const [graphNameIri, setGraphNameIriState] = useState(defaultNewTab.graphNameIri);
    // const [timeOutVal, setTimeoutValState] = useState(defaultNewTab.timeOutVal);
    // const [format, setFormatState] = useState(defaultNewTab.format);
    // const [responseWindowFormat, setResponseWindowFormatState] = useState(defaultNewTab.responseWindowFormat);
    // const [currentlyChosenOlderQuery, setCurrentlyChosenOlderQueryState] = useState(defaultNewTab.currentlyChosenOlderQuery);
    // const [checkboxVal, setCheckboxValState] = useState(defaultNewTab.checkboxVal);
    // const [queryNameVal, setQueryNameValState] = useState(defaultNewTab.queryNameVal);
    // const [previewType, setPreviewTypeState] = useState(defaultNewTab.previewType);
    // const [theme, setThemeState] = useState(defaultNewTab.theme);
    // const [responseWindowHeight, setResponseWindowHeightState] = useState(defaultNewTab.responseWindowHeight);
    // const [currentMarker, setCurrentMarkerState] = useState(defaultNewTab.currentMarker);
    // const [responseWindowResponse, setWindowResponseState] = useState('');
    // const [responseWindowResponseTable, setWindowResponseTableState] = useState('');

    function createNewTab(newTab) {
        if (!newTab) {
            setTabsLabels([...tabsLabels, 'Untitled']);
            tabs.push(defaultNewTab);
        } else {
            setTabsLabels([...tabsLabels, newTab?.queryNameVal || 'Untitled']);
            let fullNewTab = {
                ...defaultNewTab,
                ...newTab,
            };
            tabs.push(fullNewTab);
        }
        setTabs([...tabs]);
        setCurrentTab(tabs.length - 1);
    }

    function removeTab(tabIndex) {
        if (tabs.length > 1) {
            tabs.splice(tabIndex, 1);
            tabsLabels.splice(tabIndex, 1);
            if (currentTab >= tabIndex) {
                setCurrentTab(currentTab - 1);
            }

            setTabs([...tabs]);
            setTabsLabels([...tabsLabels]);
        }
    }

    function setSparqlQueryVal(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            sparqlQueryVal: data,
        };
        setTabs([...tabs]);
    }

    function setUrl(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            url: data,
        };
        setTabs([...tabs]);
    }

    function setGraphNameIri(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            graphNameIri: data,
        };
        setTabs([...tabs]);
    }

    function setTimeoutVal(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            timeOutVal: data,
        };
        setTabs([...tabs]);
    }

    function setFormat(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            format: data,
        };
        setTabs([...tabs]);
    }

    function setResponseWindowFormat(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            responseWindowFormat: data,
        };
        setTabs([...tabs]);
    }

    function setCurrentlyChosenOlderQuery(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            currentlyChosenOlderQuery: data,
        };
        setTabs([...tabs]);
    }

    function setCheckboxVal(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            checkboxVal: data,
        };
        setTabs([...tabs]);
    }

    function setQueryNameVal(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            queryNameVal: data,
        };
        tabsLabels[currentTab] = data;
        setTabs([...tabs]);
        setTabsLabels([...tabsLabels]);
    }

    function setPreviewType(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            previewType: data,
        };
        setTabs([...tabs]);
    }

    function setTheme(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            theme: data,
        };
        setTabs([...tabs]);
    }

    function setResponseWindowHeight(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            responseWindowHeight: data,
        };
        setTabs([...tabs]);
    }

    function setCurrentMarker(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            currentMarker: data,
        };
        setTabs([...tabs]);
    }

    function setWindowResponse(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            windowResponse: data,
        };
        setTabs([...tabs]);
    }

    function setWindowResponseTable(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            windowResponseTable: data,
        };
        setTabs([...tabs]);
    }

    return {
        sparqlQueryVal: tabs[currentTab]?.sparqlQueryVal,
        setSparqlQueryVal: setSparqlQueryVal,
        url: tabs[currentTab]?.url,
        setUrl: setUrl,
        graphNameIri: tabs[currentTab]?.graphNameIri,
        setGraphNameIri: setGraphNameIri,
        timeOutVal: tabs[currentTab]?.timeOutVal,
        setTimeoutVal: setTimeoutVal,
        format: tabs[currentTab]?.format,
        setFormat: setFormat,
        responseWindowFormat: tabs[currentTab]?.responseWindowFormat,
        setResponseWindowFormat: setResponseWindowFormat,
        currentlyChosenOlderQuery: tabs[currentTab]?.currentlyChosenOlderQuery,
        setCurrentlyChosenOlderQuery: setCurrentlyChosenOlderQuery,
        checkboxVal: tabs[currentTab]?.checkboxVal,
        setCheckboxVal: setCheckboxVal,
        queryNameVal: tabs[currentTab]?.queryNameVal,
        setQueryNameVal: setQueryNameVal,
        previewType: tabs[currentTab]?.previewType,
        setPreviewType: setPreviewType,
        theme: tabs[currentTab]?.theme,
        setTheme: setTheme,
        responseWindowHeight: tabs[currentTab]?.responseWindowHeight,
        setResponseWindowHeight: setResponseWindowHeight,
        currentMarker: tabs[currentTab]?.currentMarker,
        setCurrentMarker: setCurrentMarker,
        windowResponse: tabs[currentTab]?.windowResponse,
        setWindowResponse: setWindowResponse,
        windowResponseTable: tabs[currentTab]?.windowResponseTable,
        setWindowResponseTable: setWindowResponseTable,
        setCurrentTab: setCurrentTab,
        currentTab: currentTab,
        createNewTab,
        tabsLabels,
        setTabsLabels,
        closeTab: removeTab,
    };
};
