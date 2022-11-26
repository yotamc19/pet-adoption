import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Alert, Box, Button, ButtonGroup, CardActions, CardMedia, useTheme } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePetContext } from '../contexts/PetContext';
import axios from 'axios';

export default function FullPetCard({ petId }) {
    const { currentPet, setCurrentPet } = usePetContext();
    const { showAlert, toggleShowAlert, isLoggedIn, loggedUser } = useAuthContext();
    const { savedPets, setSavedPets, saveButtonTxt, setSaveButtonTxt } = usePetContext();

    const [alertTxt, setAlertTxt] = useState('');

    useEffect(() => {
        const getPet = async () => {
            const pet = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet/${petId}`, { withCredentials: true });
            return pet;
        }

        getPet()
            .then((res) => { setCurrentPet(res.data[0]) })
            .catch((err) => { console.log(err) });

        const petExist = savedPets.filter(pet => pet._id == currentPet._id);
        if (petExist.length) {
            setSaveButtonTxt('Forget');
        } else {
            setSaveButtonTxt('Save');
        }
    }, [])

    const handleReturn = async () => {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/pet/${currentPet._id}/return`, currentPet, { withCredentials: true });
        const pet = res.data;
        setCurrentPet(pet);
        setAlertTxt(`You returned ${currentPet.name} :(`);
        toggleShowAlert(true);
    }

    const handleAdoptOrFoster = async (e) => {
        if (isLoggedIn) {
            const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/pet/${currentPet._id}/adopt`, { type: e.target.name }, { withCredentials: true });
            const pet = res.data;
            setCurrentPet(pet);
            setAlertTxt(`You have taken ${currentPet.name}! Congratulations!`);
            toggleShowAlert(true);
        } else {
            setAlertTxt('You have to be logged in');
            toggleShowAlert(true);
        }
    }

    const handleSave = async () => {
        toggleShowAlert(false);

        if (isLoggedIn) {
            const petExist = savedPets.filter(pet => pet._id === currentPet._id);
            if (petExist.length) {
                const list = savedPets.filter(pet => pet._id !== currentPet._id);
                const res = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pet/${currentPet._id}/save`, { withCredentials: true });
                const updatedUser = res.data;
                setSavedPets(updatedUser.savedPets);
                const flag = updatedUser.savedPets.filter(p => p._id === currentPet._id);
                if (!flag.length) {
                    setAlertTxt(`${currentPet.name} removed from saved`);
                    toggleShowAlert(true);
                    setSaveButtonTxt('Save');
                }
            } else {
                savedPets.push(currentPet);
                const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/pet/${currentPet._id}/save`, {}, { withCredentials: true });
                const updatedUser = res.data;
                setSavedPets(updatedUser.savedPets);
                const flag = updatedUser.savedPets.filter(p => p._id === currentPet._id);
                if (flag.length) {
                    setAlertTxt(`${currentPet.name} added to saved`);
                    toggleShowAlert(true);
                    setSaveButtonTxt('Forget');
                }
            }
        } else {
            setAlertTxt('You have to be logged in');
            toggleShowAlert(true);
        }
    }

    return (
        <Card sx={{ display: 'flex' }}>
            <img className='fullcard-image' src={currentPet.img} alt="pet image" />
            <Box sx={{ display: 'flex', flexDirection: 'column', marginX: 'auto', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {currentPet.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Type: {currentPet.type}<br />
                            Adoption status: {currentPet.adopStatus === '' ? 'Needs a home' : currentPet.adopStatus}<br />
                            Height: {currentPet.height}cm<br />
                            Weight: {currentPet.weight}kg<br />
                            Color: {currentPet.color}<br />
                            Hypoallergnic: {currentPet.hypo ? 'Yes' : 'No'}<br />
                            Dietery: {currentPet.dietery.toString()}<br />
                            Breed: {currentPet.breed}<br />
                            Bio: {currentPet.bio}<br />
                        </Typography>
                    </Box>
                </CardContent>
                <CardActions sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'cente', alignItems: 'cente' }}>
                    {
                        showAlert ?
                            <Alert severity="info" sx={{ paddingY: 0, marginBottom: 2, marginX: 'auto', width: '100%' }}>{alertTxt}</Alert>
                            :
                            ''
                    }
                    <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{ marginX: 'auto !important' }}>
                        {
                            currentPet.adopStatus === '' ?
                                <>
                                    <Button variant='contained' name='Fostered' onClick={handleAdoptOrFoster}>Foster</Button>
                                    <Button variant='contained' name='Adopted' onClick={handleAdoptOrFoster}>Adopt</Button>
                                    <Button variant='contained' onClick={handleSave}>{saveButtonTxt}</Button>
                                </>
                                :
                                currentPet.ownerEmail === loggedUser.email ?
                                    currentPet.adopStatus === 'Fostered' ?
                                        <>
                                            <Button variant='contained' name='Adopted' onClick={handleAdoptOrFoster}>Adopt</Button>
                                            <Button variant='contained' name='Return' onClick={handleReturn}>Return</Button>
                                            <Button variant='contained' onClick={handleSave}>{saveButtonTxt}</Button>
                                        </>
                                        :
                                        <>
                                            <Button variant='contained' name='Return' onClick={handleReturn}>Return</Button>
                                            <Button variant='contained' onClick={handleSave}>{saveButtonTxt}</Button>
                                        </>
                                    :
                                    <Button variant='contained' onClick={handleSave}>{saveButtonTxt}</Button>
                        }
                    </ButtonGroup>
                </CardActions >
            </Box>
        </Card >
    );
}