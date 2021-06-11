import Text from 'module/components/Text';
import View from 'module/components/View';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import { headers } from 'styles';
import { useSelector } from 'react-redux';
import { stateHasFailed, stateIsLoaded } from 'services/stateHelpers';

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const singlePublicQueryState = useSelector(state => state.singlePublicQuery);

    function createANotification(title, message, type) {
        let notification = {
            title: title,
            message: message,
            type: type,
            open: false,
        };
        setNotifications(notifs => [...notifs, notification]);
        setTimeout(() => {
            notification.open = true;
            // console.log(notification, notifications);
            setNotifications(notifs => [...notifs]);
        }, 100);
        setTimeout(() => {
            notification.open = false;
            setNotifications(notifs => [...notifs]);
            setTimeout(() => {
                let index = notifications.indexOf(notification);
                // notifications.splice(index, 1);
                setNotifications(notifs => {
                    notifs.splice(index, 1);
                    return [...notifs];
                });
            }, 500);
        }, 5000);
    }

    function notifySuccess(title, msg) {
        createANotification(title, msg, 'success');
    }
    function notifyError(title, msg) {
        createANotification(title, msg, 'error');
    }

    useEffect(() => {
        if (stateHasFailed(singlePublicQueryState)) {
            // console.log()
            notifyError('Failed to open query', "Query with the given id doesn't exist");
        } else if (stateIsLoaded(singlePublicQueryState)) {
            notifySuccess('Success', 'The query is opened in a new tab');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singlePublicQueryState]);

    // useEffect(() => {
    //     createANotification('Error', 'error', 'error');
    //     createANotification('Error2', 'error', 'error');
    //     setTimeout(() => {
    //         createANotification('Error3', 'success', 'success');
    //     }, 3000);
    //     setTimeout(() => {
    //         createANotification('Error4', 'error', 'success');
    //     }, 10000);
    // }, []);
    return (
        <>
            {notifications.map((el, index) => {
                return (
                    <View
                        key={index}
                        style={{
                            position: 'fixed',
                            width: 200,
                            // height: 75,
                            backgroundColor: el.type === 'error' ? '#FDF2F480' : '#06AA6D90',
                            right: el.open ? 20 : -250,
                            top: 100 + 75 * index * 1.2,
                            transition: '0.5s',
                            zIndex: 99,
                            // justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        {el.type === 'error' && <WarningIcon color={'error'} style={{ width: 25, height: 25, padding: 5 }}></WarningIcon>}
                        {el.type === 'success' && <CheckIcon style={{ width: 25, height: 25, padding: 5, color: 'white' }}></CheckIcon>}
                        <View style={{ padding: 10 }}>
                            <Text style={{ ...headers.H5(el.type === 'success' ? 'white' : 'black', 'Bold'), paddingBottom: 5 }}>{el.title}</Text>
                            <Text style={{ ...headers.H6(el.type === 'success' ? 'white' : 'black') }}>{el.message}</Text>
                        </View>
                    </View>
                );
            })}
            {children}
        </>
    );
};
