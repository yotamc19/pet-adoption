import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FullPetCard from '../components/FullPetCard';
import { useParams } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
}));

export default function PetPage() {
    const { id } = useParams();

    return (
        <Box sx={{
            flexGrow: 1, margin: 3,
        }}>
            <Grid container justifyContent='center' spacing={2}>
                <Grid item xs={8}>
                    <FullPetCard petId={id} />
                </Grid>
            </Grid>
        </Box>
    );
}