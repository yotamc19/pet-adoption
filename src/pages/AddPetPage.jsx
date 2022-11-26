import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Card, CardActions, CardContent, FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import { useAddPetContext } from '../contexts/AddPetContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from '../contexts/DashboardContext';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function AddPetsPage() {
    const { showAlert, toggleShowAlert } = useAuthContext();
    const { values, setValues, updateMode, setUpdateMode, updatedPetId, setUpdatedPetId } = useAddPetContext();
    const { setShowPetsList } = useDashboardContext();
    const navigate = useNavigate();

    const [petImage, setPetImage] = useState();
    const [errors, setErrors] = useState({
        name: false,
        type: false,
        color: false,
        breed: false,
        weight: false,
        height: false,
    })
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertTxt, setAlertTxt] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(false);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }

    const handleAddPet = async () => {
        setErrors({
            name: false,
            type: false,
            color: false,
            breed: false,
            weight: false,
            height: false,
        });
        if (values.name !== '' && values.type !== '' && values.color !== '' && values.breed !== '' && values.weight !== '' && values.height !== '' && petImage) {
            const fd = new FormData();
            for (let key in values) {
                if (key === 'dietery') {
                    const arr = values[key].split(' ');
                    fd.append(key, arr);
                } else {
                    fd.append(key, values[key]);
                }
            }
            if (petImage) {
                fd.append('petImage', petImage);
            }
            setBtnDisabled(true);
            try {
                await axios.post(`${process.env.REACT_APP_SERVER_URL}/pet`, fd, { withCredentials: true });
                setValues({
                    name: '',
                    type: '',
                    color: '',
                    breed: '',
                    weight: '',
                    height: '',
                    hypo: '',
                    dietery: '',
                    bio: '',
                });
                setPetImage(null);
                setAlertSeverity('success');
                setAlertTxt('Pet added!');
                toggleShowAlert(true);
            } catch (err) {
                console.log(err);
                setAlertSeverity('error');
                setAlertTxt('Problem connecting to the server');
            }
            setBtnDisabled(false);
        } else {
            toggleShowAlert(false);
            if (!petImage) {
                toggleShowAlert(true);
                setAlertSeverity('error');
                setAlertTxt('Please upload an image for the pet');
            }
            setPetImage(null);
            setErrors({
                name: values.name === '',
                type: values.type === '',
                color: values.color === '',
                breed: values.breed === '',
                weight: values.weight === '',
                height: values.height === '',
            });
        }
    }

    const handleUpdatePet = async () => {
        setErrors({
            name: false,
            type: false,
            color: false,
            breed: false,
            weight: false,
            height: false,
        });
        if (values.name !== '' && values.type !== '' && values.color !== '' && values.breed !== '' && values.weight !== '' && values.height !== '' && petImage) {
            const fd = new FormData();
            for (let key in values) {
                if (key === 'dietery') {
                    const arr = values[key].split(' ');
                    fd.append(key, arr);
                } else {
                    fd.append(key, values[key]);
                }
            }
            fd.append('petImage', petImage);
            setBtnDisabled(true);
            try {
                await axios.put(`${process.env.REACT_APP_SERVER_URL}/pet/${updatedPetId}`, fd, { withCredentials: true });
                setUpdatedPetId('');
                setValues({
                    name: '',
                    type: '',
                    color: '',
                    breed: '',
                    weight: '',
                    height: '',
                    hypo: '',
                    dietery: '',
                    bio: '',
                });
                setPetImage(null);
                setUpdateMode(false);
                setShowPetsList(true);
                navigate('/dashboard');
            } catch (err) {
                console.log(err);
                toggleShowAlert(true);
                setAlertSeverity('error');
                setAlertTxt('Problem connecting to the server');
            }
            setBtnDisabled(false);
        } else {
            toggleShowAlert(false);
            if (!petImage) {
                toggleShowAlert(true);
                setAlertSeverity('error');
                setAlertTxt('Please upload an image for the pet');
            }
            setPetImage(null);
            setErrors({
                name: values.name === '',
                type: values.type === '',
                color: values.color === '',
                breed: values.breed === '',
                weight: values.weight === '',
                height: values.height === '',
            });
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
                                <TextField id="outlined-basic" required error={errors.name} label="Name" name='name' value={values.name} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel id="demo-simple-select-label" error={errors.type} required>Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label='type'
                                        name="type"
                                        error={errors.type}
                                        value={values.type}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='Dog'>Dog</MenuItem>
                                        <MenuItem value='Cat'>Cat</MenuItem>
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" required error={errors.color} label="Color" name='color' value={values.color} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" required error={errors.breed} label="Breed" name='breed' value={values.breed} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField
                                    label="Weight"
                                    name='weight'
                                    required
                                    error={errors.weight}
                                    value={values.weight}
                                    onChange={handleChange}
                                    id="outlined-start-adornment"
                                    sx={{ m: 1, width: '100%' }}
                                    type='number'
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                    }}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField
                                    label="Height"
                                    name='height'
                                    required
                                    error={errors.height}
                                    value={values.height}
                                    onChange={handleChange}
                                    id="outlined-start-adornment"
                                    sx={{ m: 1, width: '100%' }}
                                    type='number'
                                    InputProps={{
                                        inputProps: { min: 1 },
                                        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                    }}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel id="demo-simple-select-label">Hypoallergenic</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label='Hypoallergenic'
                                        name="hypo"
                                        value={values.hypo}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='true'>Yes</MenuItem>
                                        <MenuItem value='false'>No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={6}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField id="outlined-basic" label="Dietary restrictions" name='dietery' value={values.dietery} onChange={handleChange} variant="outlined" sx={{ m: 1, width: '100%' }} />
                            </Item>
                        </Grid>
                        <Grid item xs={12}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Bio"
                                    name='bio'
                                    fullWidth
                                    multiline
                                    value={values.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    sx={{ m: 1 }}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={6} sx={{}}>
                            <Item className='d-flex align-items-center justify-content-center shadow-none'>
                                <input type="file" onChange={(e) => {
                                    setPetImage(e.target.files[0]);
                                }
                                } accept="image/*"></input>
                            </Item>
                        </Grid>
                    </Grid>
                </CardContent>
                {
                    showAlert ?
                        <CardActions className='d-flex align-items-center justify-content-between m-2'>
                            <Alert severity={alertSeverity}>{alertTxt}</Alert>
                            {
                                updateMode ?
                                    <Button variant='contained' size="small" disabled={btnDisabled} sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleUpdatePet}>Update pet</Button>
                                    :
                                    <Button variant='contained' size="small" disabled={btnDisabled} sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleAddPet}>Add pet</Button>
                            }
                        </CardActions>
                        :
                        <CardActions className='d-flex align-items-center justify-content-end m-2'>
                            {
                                updateMode ?
                                    <Button variant='contained' size="small" disabled={btnDisabled} sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleUpdatePet}>Update pet</Button>
                                    :
                                    <Button variant='contained' size="small" disabled={btnDisabled} sx={{ p: 1, paddingX: 3, marginY: 1 }} onClick={handleAddPet}>Add pet</Button>
                            }
                        </CardActions>
                }
            </Card>
        </Box>
    );
}