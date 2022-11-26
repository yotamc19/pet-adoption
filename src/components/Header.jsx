import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import TemporaryDrawer from './Sidebar';
import { useSidebarContext } from '../contexts/SidebarContext';
import { useState } from 'react';
import SearchForm from './SearchForm';
import { useAuthContext } from '../contexts/AuthContext';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useModalsContext } from '../contexts/ModalsContext';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePetContext } from '../contexts/PetContext';

export default function SearchAppBar() {
    const { toggleSidebar } = useSidebarContext();
    const { toggleLogin } = useModalsContext();
    const { setSavedPets } = usePetContext();
    const { setErrors } = useModalsContext();
    const { isLoggedIn, toggleLoginState, loggedUser, changeLoggedUser, toggleShowAlert } = useAuthContext();
    const navigate = useNavigate();

    const handleClick = () => {
        toggleSidebar(true);
    }

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/logout`, { withCredentials: true });
            toggleLoginState(false);
            setSavedPets([]);
            changeLoggedUser({
                id: '',
                name: '',
                email: '',
                isAdmin: false,
            });
            setErrors({
                email: {
                    error: false,
                    helperText: '',
                },
                password: {
                    error: false,
                    helperText: '',
                },
                repassword: {
                    error: false,
                },
                firstName: {
                    error: false,
                    helperText: '',
                },
                lastName: {
                    error: false,
                    helperText: '',
                },
                phoneNumber: {
                    error: false,
                    helperText: '',
                },
            })
            toggleShowAlert(false);
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }} className='poppins'>
            <AppBar position="static">
                <Toolbar className='header'>
                    {isLoggedIn ?
                        <>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleClick}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <TemporaryDrawer />
                        </>
                        :
                        ''
                    }
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        onClick={() => { navigate('/') }}
                    >
                        Pet Adoption
                    </Typography>
                    {isLoggedIn ?
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            Hi {loggedUser.firstName} {loggedUser.lastName}!
                        </Typography>
                        : ''
                    }
                    <div className='d-flex align-items-center'>
                        <div className='me-3'>
                            <SearchForm />
                        </div>
                        {isLoggedIn ?
                            <IconButton onClick={handleLogout}>
                                <LogoutIcon />
                            </IconButton>
                            :
                            <>
                                <IconButton onClick={() => { toggleLogin(true) }}>
                                    <LoginIcon />
                                </IconButton>
                                <LoginModal />
                                <SignupModal />
                            </>
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
