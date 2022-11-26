import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useModalsContext } from '../contexts/ModalsContext';
import { useAuthContext } from '../contexts/AuthContext';
import { useSidebarContext } from '../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePetContext } from '../contexts/PetContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
};

export default function LoginModal() {
    const { showLogin, toggleLogin, userDetails, setUserDetails, errors, setErrors, toggleSignup } = useModalsContext();
    const { toggleLoginState, changeLoggedUser, changeProfileDetails } = useAuthContext();
    const { toggleSidebar } = useSidebarContext();
    const { setSavedPets } = usePetContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    }

    const handleLogin = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/login`, {
                email: userDetails.email,
                password: userDetails.password,
            }, { withCredentials: true });
            toggleLoginState(true);
            toggleLogin(false);
            toggleSidebar(false);
            changeLoggedUser(res.data);
            setSavedPets(res.data.savedPets);
            changeProfileDetails({
                email: res.data.email, 
                phoneNumber: res.data.phoneNumber, 
                firstName: res.data.firstName, 
                lastName: res.data.lastName, 
            });
            navigate(`/`);
        } catch (err) {
            const message = err.response.data;
            if (message === 'User does not exists') {
                setErrors({
                    ...errors,
                    email: {
                        error: true,
                        helperText: message,
                    },
                    password: {
                        error: false,
                        helperText: '',
                    },
                });
            } else {
                setErrors({
                    ...errors,
                    email: {
                        error: false,
                        helperText: '',
                    },
                    password: {
                        error: true,
                        helperText: message,
                    },
                });
            }
        }
    }

    return (
        <Modal
            open={showLogin}
            onClose={() => { toggleLogin(false) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='rounded border-none d-flex flex-column align-items-center justify-content-between' sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Login
                </Typography>
                <TextField error={errors.email.error} helperText={errors.email.helperText} label="Email" variant="standard" type='email' name='email' value={userDetails.email} onChange={handleChange} />
                <TextField error={errors.password.error} helperText={errors.password.helperText} label="Password" variant="standard" type='password' name='password' value={userDetails.password} onChange={handleChange} />
                <div className='d-flex justify-content-between mt-4 w-100'>
                    <Button variant="text" onClick={() => {
                        toggleSignup(true);
                        toggleLogin(false);
                    }}>Sign Up</Button>
                    <Button variant="contained" onClick={handleLogin}>Login</Button>
                </div>
            </Box>
        </Modal>
    );
}