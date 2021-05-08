import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';

import { tokenHelper } from 'services/tokenHelpers';

const formatOptions = {
    select: [
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
    ],
    construct: [
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
    ],
    describe: [
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
    ],
    ask: [
        {
            name: 'Json',
            value: 'application/json',
        },
    ],
};

export const useTabConfig = history => {
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
        saveCheckBoxVal: false,
        queryNameVal: 'Untitled',
        previewType: 'response',
        theme: 'darcula',
        responseWindowHeight: 250,
        currentMarker: null,
        windowResponse: '',
        windowResponseTable: null,
        queryType: 'select',
    };
    const [tabs, setTabs] = useState([defaultNewTab]);
    const [localhostLoaded, setLocalhostLoaded] = useState(false);
    const [triggerCodeMirrorStateChange, setTrigger] = useState(false);

    const [currentTab, setCurrentTab] = useState(0);
    const [tabsLabels, setTabsLabels] = useState(['Untitled']);
    const [privateModifierCheckBoxVal, setPrivateModifierCheckBoxVal] = useState(false);

    useEffect(() => {
        console.log('on start only');
        let tabsDataString = localStorage.getItem('persist:tabs');
        let tabsLabelsString = localStorage.getItem('persist:tabsLabels');

        if (tabsDataString) {
            try {
                let tabsFromString = JSON.parse(tabsDataString);

                let tabsLabelsFromString = JSON.parse(tabsLabelsString);
                console.log('tabs from string');
                console.log(tabsFromString);
                setTabs(tabsFromString);
                setTabsLabels(tabsLabelsFromString);
                setLocalhostLoaded(true);
            } catch (e) {
                console.log('Something went wrong parsing saved tabs');
            }
        }

        // setSparqlQueryVal(tabs[currentTab].sparqlQueryVal);
    }, []);

    useEffect(() => {
        if (history && tabs[currentTab].isPublic) {
            history.replace('/sparql?query_id=' + tabs[currentTab].queryId);
        } else if (history) {
            if (localhostLoaded) {
                history.replace('/sparql');
            }
        }
    }, [currentTab]);

    useEffect(() => {
        // console.log('this useffect is in effect');

        let tabsToSave = [];
        tabs.forEach(tab => {
            let { currentMarker, windowResponse, windowResponseTable, ...rest } = tab;
            tabsToSave.push({ ...rest, windowResponse: '', windowResponseTable: null, currentMarker: null });
        });

        localStorage.setItem('persist:tabs', JSON.stringify(tabsToSave));
        localStorage.setItem('persist:tabsLabels', JSON.stringify(tabsLabels));
    }, [tabs]);

    useEffect(() => {}, []);

    function createNewTab(newTab, isPublic, queryId) {
        // console.log(queryId);
        let oldTabIndex = tabs.findIndex(el => el.queryId == queryId);
        console.log('creating', oldTabIndex);
        if (oldTabIndex != -1 && queryId != undefined) {
            setCurrentTab(oldTabIndex);
            return;
        }
        if (!newTab) {
            setTabsLabels([...tabsLabels, 'Untitled']);
            tabs.push(defaultNewTab);
        } else {
            setTabsLabels([...tabsLabels, newTab?.queryNameVal || 'Untitled']);
            let fullNewTab = {
                ...defaultNewTab,
                ...newTab,
                isPublic: isPublic,
                queryId: queryId,
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
            if (currentTab >= tabIndex && currentTab > 0) {
                setCurrentTab(currentTab - 1);
            } else {
                setTrigger(!triggerCodeMirrorStateChange);
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

    function setSaveCheckboxVal(data) {
        tabs[currentTab] = {
            ...tabs[currentTab],
            saveCheckBoxVal: data,
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

    function setQueryType(data) {
        if (tabs[currentTab].queryType != data) {
            tabs[currentTab] = {
                ...tabs[currentTab],
                queryType: data.toLowerCase(),
                format: formatOptions[data.toLowerCase()][0].value,
            };
            setTabs([...tabs]);
        }
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
        saveCheckBoxVal: tabs[currentTab]?.saveCheckBoxVal,
        setSaveCheckboxVal: setSaveCheckboxVal,
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
        queryType: tabs[currentTab]?.queryType,
        setQueryType,
        setCurrentTab: setCurrentTab,
        currentTab: currentTab,
        createNewTab,
        tabsLabels,
        setTabsLabels,
        closeTab: removeTab,
        privateModifierCheckBoxVal,
        setPrivateModifierCheckBoxVal,
        localhostLoaded,
        triggerCodeMirrorStateChange,
        formatOptions,
        queryId: tabs[currentTab]?.queryId,
        isPublic: tabs[currentTab]?.isPublic,
    };
};
