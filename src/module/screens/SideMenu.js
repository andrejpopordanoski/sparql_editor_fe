import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { colors, headers } from 'styles';
import SavedQueryOption from '../components/SavedQueryOption';
import Text from '../components/Text';
import View from '../components/View';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedQueryResultAction } from 'redux/actions/data.actions';
export default function SideMenu({ useTabConfig }) {
    // const [saveResponseToggle, setSaveResponseToggle] = useState(false);
    const dispatch = useDispatch(0);

    const { checkboxVal, setCheckboxVal, setCurrentlyChosenOlderQuery, createNewTab } = useTabConfig;
    const allQueries = useSelector(state => state.allQueries);

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
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 5,
                        background: colors.backgroundLightGray1(),
                        border: colors.borderGrayColor(),
                    }}
                >
                    <View
                        style={{ paddingRight: 10, cursor: 'pointer' }}
                        onClick={() => {
                            setCheckboxVal(!checkboxVal);
                        }}
                    >
                        {!checkboxVal && (
                            <ToggleOffIcon color="secondary" fontSize="large">
                                {' '}
                            </ToggleOffIcon>
                        )}
                        {checkboxVal && <ToggleOnIcon fontSize="large" color="primary"></ToggleOnIcon>}
                    </View>
                    <View>
                        <Text style={{ ...headers.H5(null, 'Light') }}> Save queries on run </Text>
                    </View>
                </View>
                <View>
                    <Text style={{ ...headers.H4(null, 'Regular'), marginLeft: 10, marginTop: 15, marginBottom: 15 }}> Saved queries </Text>
                    {allQueries?.data.data &&
                        allQueries?.data?.data.map(el => {
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
                                        createNewTab(newTab);
                                    }}
                                    name={el.queryName + (el.queryNameSuffix ? el.queryNameSuffix : '')}
                                    url={el.url}
                                ></SavedQueryOption>
                            );
                        })}
                </View>
            </View>
        </ResizableBox>
    );
}
