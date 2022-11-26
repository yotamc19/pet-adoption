import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import { useModalsContext } from '../contexts/ModalsContext';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ProfilePage() {
    const { profileDetails, changeProfileDetails, validateEmail, validateFirstName, validateLastName, validatePhoneNumber, changeLoggedUser, showAlert, toggleShowAlert, loggedUser } = useAuthContext();
    const { errors, setErrors } = useModalsContext();
    const navigate = useNavigate();

    const handleChange = (e) => {
        changeProfileDetails({
            ...profileDetails,
            [e.target.name]: e.target.value,
        });
    }

    const handleUpdate = async () => {
        const emailFlag = await validateEmail(profileDetails.email);
        const firstNameFlag = validateFirstName(profileDetails.firstName);
        const lastNameFlag = validateLastName(profileDetails.lastName);
        const phoneNumberFlag = validatePhoneNumber(profileDetails.phoneNumber);
        setErrors({
            email: {
                error: !emailFlag,
                helperText: !emailFlag ? 'Invalid email address' : '',
            },
            password: {
                error: false,
                helperText: '',
            },
            repassword: {
                error: false,
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
        if (emailFlag && firstNameFlag && lastNameFlag && phoneNumberFlag) {
            try {
                const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${loggedUser._id}`, profileDetails, { withCredentials: true });
                toggleShowAlert(true);
                changeLoggedUser({
                    ...loggedUser,
                    ...profileDetails,
                });
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

    const handleChangePassword = () => {
        toggleShowAlert(false);
        navigate('/change-password');
    }

    return (
        <Box sx={{
            flexGrow: 1, margin: 3,
        }}>
            <Card sx={{ minWidth: 275, p: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    <Grid className='h-100' container spacing={2} sx={{ p: 0 }}>
                        <Grid item xs={6} sx={{}}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" error={errors.email.error} helperText={errors.email.helperText} label="Email" name='email' value={profileDetails.email} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6} sx={{}}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" error={errors.phoneNumber.error} helperText={errors.phoneNumber.helperText} label="Phone Number" name='phoneNumber' value={profileDetails.phoneNumber} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6} sx={{}}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" error={errors.firstName.error} helperText={errors.firstName.helperText} label="First Name" name='firstName' value={profileDetails.firstName} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6} sx={{}}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" error={errors.lastName.error} helperText={errors.lastName.helperText} label="Last Name" name='lastName' value={profileDetails.lastName} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                    </Grid>
                </CardContent>
                {
                    showAlert ?
                        <CardActions className='d-flex align-items-center justify-content-between m-2'>
                            <Alert severity="success">User details updated succesfully!</Alert>
                            <div>
                                <Button variant='contained' size="small" sx={{ p: 1, paddingX: 3, m: 1 }} onClick={handleChangePassword}>Change password</Button>
                                <Button variant='contained' size="small" sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleUpdate}>Update</Button>
                            </div>
                        </CardActions>
                        :
                        <CardActions className='d-flex align-items-center justify-content-end m-2'>
                            <Button variant='contained' size="small" sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleChangePassword}>Change password</Button>
                            <Button variant='contained' size="small" sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleUpdate}>Update</Button>
                        </CardActions>
                }
            </Card>
        </Box>
    );
}