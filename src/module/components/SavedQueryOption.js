import React, { useState } from 'react';
import { colors, headers } from 'styles';
import Text from './Text';
import View from './View';
import DeleteIcon from '@material-ui/icons/Delete';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useDispatch } from 'react-redux';
import { deleteQueryAction } from 'redux/actions/data.actions';

export default function SavedQueryOption({ name, url, onClick, author, showAuthor, id, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);
    const [deleteIconHover, setDeleteIconHover] = useState(false);
    const dispatch = useDispatch();
    let submit = () => {
        confirmAlert({
            title: 'Delete query    ',
            message: 'Are you sure you want to delete the query?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        dispatch(deleteQueryAction(id));
                    },
                },
                {
                    label: 'No',
                    onClick: () => {},
                },
            ],
        });
    };

    return (
        <View
            style={{
                // flex: 1,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 10,
                paddingBottom: 10,
                cursor: 'pointer',
                background: isHovered ? colors.backgroundLightGray2() : colors.backgroundLightGray(),
                borderBottom: `1px solid ${colors.borderGrayColor(50)}`,
                flexDirection: 'row',
                alignItems: 'center',
            }}
        >
            <View
                style={{ flex: 1 }}
                onClick={onClick}
                onMouseEnter={() => {
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                }}
            >
                <Text style={{ ...headers.H5(null, 'Italic'), paddingBottom: 5 }}> {name} </Text>
                <Text style={{ ...headers.H6(null, 'Light'), wordWrap: 'break-word' }}>{url}</Text>
                {showAuthor && (
                    <Text style={{ ...headers.H6(null, 'Light', 12), wordWrap: 'break-word', paddingTop: 5 }}>
                        by <Text style={{ ...headers.H6(null, 'Bold', 12) }}>{author}</Text>
                    </Text>
                )}
            </View>
            {!showAuthor && (
                <DeleteIcon
                    onMouseEnter={() => {
                        setDeleteIconHover(true);
                    }}
                    onMouseLeave={() => {
                        setDeleteIconHover(false);
                    }}
                    color={deleteIconHover ? 'primary' : 'secondary'}
                    onClick={() => {
                        submit();
                    }}
                ></DeleteIcon>
            )}
        </View>
    );
}
