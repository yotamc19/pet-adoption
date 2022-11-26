import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MinimizedPetCard from '../components/MinimizedPetCard';
import NoPets from '../components/NoPets';
import { usePetContext } from '../contexts/PetContext';
import { Card, CardContent, Stack, Switch, Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

export default function MyPetsPage() {
    const { petsList, showPetsAtHome, setShowPetsAtHome, savedPets } = usePetContext();

    const handleChange = () => {
        setShowPetsAtHome(!showPetsAtHome);
    }

    return (
        <Box sx={{
            flexGrow: 1, margin: 3,
        }}>
            <Card sx={{ minWidth: 275, p: 3 }}>
                <CardContent sx={{ p: '0 !important' }}>
                    <div className='d-flex mb-3'>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ marginX: 'auto' }}>
                            <Typography>Saved pets</Typography>
                            <AntSwitch checked={showPetsAtHome} inputProps={{ 'aria-label': 'ant design' }} onChange={handleChange} />
                            <Typography>At your home</Typography>
                        </Stack>
                    </div>
                    <Grid container spacing={2}>
                        {
                            showPetsAtHome ?
                                petsList.length ?
                                    petsList.map((pet) =>
                                        <Grid item xs={3} key={pet._id}>
                                            <Item><MinimizedPetCard pet={pet} /></Item>
                                        </Grid>
                                    )
                                    :
                                    <NoPets />
                                :
                                savedPets.length ?
                                    savedPets.map((pet) =>
                                        <Grid item xs={3} key={pet._id}>
                                            <Item><MinimizedPetCard pet={pet} /></Item>
                                        </Grid>
                                    )
                                    :
                                    <NoPets />
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}