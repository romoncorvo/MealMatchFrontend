import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Avatar, CardHeader, IconButton, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { addNewFollower, deleteFollower, fetchAllUsers } from '../Utils/HelperFunctions';
import { useQuery } from '@tanstack/react-query';
import { LoginResponse, User, UserListProps } from '../Utils/Types';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import "../App.css";
import { useNavigate } from 'react-router-dom';

const UsersList = (props : UserListProps) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ["listUsers" + (props.queryType && "")],
        queryFn: async () => props.fetchFunction(props.user.token, props.userId)
    });

    const navigate = useNavigate();
    function handleFollow(user: User) {
        if (props.user.followedUserIds){
            if (props.user.followedUserIds.find(id => id == user.userId)) { // unfollow path
                props.setUser({ ...props.user, followedUserIds: props.user.followedUserIds.filter(id => id !== user.userId) });
                deleteFollower(props.user.token, user.userId);
            } else {  // follow path
                props.setUser({ ...props.user, followedUserIds: [...props.user.followedUserIds, user.userId]});
                addNewFollower(props.user.token, {followedUserId: user.userId});
            }
        }
    }

    return (
    <Box className="App">
        <main style={{ width: "100%", marginTop: "56px", marginBottom: "56px" }}>
            <List>
                {data && data.map((user, index) => 
                    <ListItem disablePadding  sx={{display: 'flex'}} key={index}>
                        <ListItemButton sx={{display: 'grid', gridTemplateColumns: "2fr 1fr"}}>
                            <CardHeader
                                avatar={
                                    <Avatar
                                        aria-label="Profile Picture"
                                        src={user.profilePictureUrl}
                                    />
                                }
                                title={user.name}
                                subheader="The recipe master"
                                onClick={() => navigate(`/${user.userId}`)}
                                sx={{
                                flex: 1,
                                margin: 2
                                }}
                            />
                            <Button 
                                aria-label="Follow" 
                                onClick={() => handleFollow(user)}
                            >
                                {props.user.followedUserIds.includes(user.userId)
                                ? <><CancelOutlinedIcon sx={{marginRight: 1}} /> Unfollow</>
                                : <><CheckCircleOutlineOutlinedIcon sx={{marginRight: 1}} /> Follow</>
                            }
                            </Button>
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </main>
    </Box>
    )
}

export default UsersList