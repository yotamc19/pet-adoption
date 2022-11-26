import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function BasicCard() {
    return (
        <Card sx={{ width: 'fit-content', position: 'absolute', right: 0, bottom: 0, mr: 2, mb: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    Aren't they adorable?
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    You can adopt one of them today!
                </Typography>
                <Typography variant="body2">
                    Welcome to the Pet Adoption website!
                    <br />
                    Where we make dreams reality
                </Typography>
            </CardContent>
        </Card>
    );
}