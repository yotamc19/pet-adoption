import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useModalsContext } from '../contexts/ModalsContext';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useSidebarContext } from '../contexts/SidebarContext';

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

export default function SignupModal() {
    const { showSignup, toggleSignup, userDetails, setUserDetails, errors, setErrors } = useModalsContext();
    const { toggleLoginState, changeLoggedUser, validateEmail, validatePassword, validateFirstName, validateLastName, validatePhoneNumber, changeProfileDetails } = useAuthContext();
    const { toggleSidebar } = useSidebarContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    }

    const handleSignup = async () => {
        const emailFlag = await validateEmail(userDetails.email);
        const { passwordFlag, txtPass } = validatePassword(userDetails.password, userDetails.repassword);
        const firstNameFlag = validateFirstName(userDetails.firstName);
        const lastNameFlag = validateLastName(userDetails.lastName);
        const phoneNumberFlag = validatePhoneNumber(userDetails.phoneNumber);
        setErrors({
            email: {
                error: !emailFlag,
                helperText: !emailFlag ? 'Invalid email address' : '',
            },
            password: {
                error: !passwordFlag,
                helperText: !passwordFlag ? txtPass : '',
            },
            repassword: {
                error: !passwordFlag,
            },
            firstName: {
                error: !firstNameFlag,
                helperText: !firstNameFlag ? 'Invalid first name' : '',
            },
            lastName: {
                error: !lastNameFlag,
                helperText: !lastNameFlag ? 'Invalid last name' : '',
            },
            phoneNumber: {
                error: !phoneNumberFlag,
                helperText: !phoneNumberFlag ? 'Invalid phone number' : '',
            },
        });
        if (emailFlag && passwordFlag && firstNameFlag && lastNameFlag && phoneNumberFlag) {
            try {
                const newUser = {
                    email: userDetails.email,
                    password: userDetails.password,
                    repassword: userDetails.repassword,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    phoneNumber: userDetails.phoneNumber,
                };
                const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/signup`, newUser, { withCredentials: true });
                toggleLoginState(true);
                toggleSignup(false);
                toggleSidebar(false);
                changeLoggedUser(res.data);
                changeProfileDetails({
                    email: res.data.email,
                    phoneNumber: res.data.phoneNumber,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                });
                navigate('/');
            } catch (err) {
                console.log(err);
                setErrors({
                    ...errors,
                    email: {
                        error: true,
                        helperText: err.response.data,
                    },
                });
            }
        }
    }

    return (
        <Modal
            open={showSignup}
            onClose={() => { toggleSignup(false) }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className='rounded border-none d-flex flex-column align-items-center justify-content-between' sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Signup
                </Typography>
                <TextField error={errors.email.error} helperText={errors.email.helperText} label="Email" variant="standard" type='email' name='email' value={userDetails.email} onChange={handleChange} />
                <TextField error={errors.password.error} helperText={errors.password.helperText} label="Password" variant="standard" type='password' name='password' value={userDetails.password} onChange={handleChange} />
                <TextField error={errors.repassword.error} label="Confirm Password" variant="standard" type='password' name='repassword' value={userDetails.repassword} onChange={handleChange} />
                <TextField error={errors.firstName.error} helperText={errors.firstName.helperText} label="First Name" variant="standard" name='firstName' value={userDetails.firstName} onChange={handleChange} />
                <TextField error={errors.lastName.error} helperText={errors.lastName.helperText} label="Last Name" variant="standard" name='lastName' value={userDetails.lastName} onChange={handleChange} />
                <TextField error={errors.phoneNumber.error} helperText={errors.phoneNumber.helperText} label="Phone Number" variant="standard" name='phoneNumber' value={userDetails.phoneNumber} onChange={handleChange} />
                <div className='d-flex justify-content-between mt-4 w-100'>
                    <Button variant="text" onClick={() => { toggleSignup(false) }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSignup}>Signup</Button>
                </div>
            </Box>
        </Modal>
    );
}