import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Alert, Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function ProfilePage() {
    const { showAlert, toggleShowAlert, loggedUser } = useAuthContext();

    const [passValues, setPassValues] = useState({
        pass: '',
        repass: '',
    });
    const [errors, setErrors] = useState({
        pass: {
            error: false,
            helperText: '',
        },
        repass: {
            error: false,
            helperText: '',
        },
    });

    const handleChange = (e) => {
        setPassValues({
            ...passValues,
            [e.target.name]: e.target.value,
        });
    }

    const handleChangePassword = async () => {
        if (passValues.pass.length > 5 && passValues.pass === passValues.repass) {
            try {
                setErrors({
                    pass: {
                        error: false,
                        helperText: '',
                    },
                    repass: {
                        error: false,
                        helperText: '',
                    },
                });
                await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${loggedUser._id}/update-password`, { password: passValues.pass }, { withCredentials: true });
                toggleShowAlert(true);
                setPassValues({
                    pass: '',
                    repass: '',
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            toggleShowAlert(false);
            if (passValues.pass.length <= 5) {
                setErrors({
                    pass: {
                        error: true,
                        helperText: 'Minimum length is 6',
                    },
                    repass: {
                        error: true,
                        helperText: '',
                    },
                });
            } else {
                setErrors({
                    pass: {
                        error: true,
                        helperText: 'Passwords do not match',
                    },
                    repass: {
                        error: true,
                    },
                });
            }
        }
    }

    return (
        <Box sx={{
            flexGrow: 1, margin: 3,
        }}>
            <Card sx={{ minWidth: 275, p: 3 }}>
                <CardContent sx={{ p: 0 }}>
                    <Grid className='h-100' container spacing={2} sx={{ p: 0 }}>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" error={errors.pass.error} helperText={errors.pass.helperText} label="New Password" name='pass' value={passValues.pass} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" error={errors.repass.error} label="Repeat Password" name='repass' value={passValues.repass} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                    </Grid>
                </CardContent>
                {
                    showAlert ?
                        <CardActions className='d-flex align-items-center justify-content-between m-2'>
                            <Alert severity="success">User password updated succesfully!</Alert>
                            <Button variant='contained' size="small" sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleChangePassword}>Change password</Button>
                        </CardActions>
                        :
                        <CardActions className='d-flex align-items-center justify-content-end m-2'>
                            <Button variant='contained' size="small" sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleChangePassword}>Change password</Button>
                        </CardActions>
                }
            </Card>
        </Box>
    );
}