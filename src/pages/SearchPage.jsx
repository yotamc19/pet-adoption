import styled from "@emotion/styled";
import { Box, Card, CardContent, Grid, listClasses } from "@mui/material";
import Paper from '@mui/material/Paper';
import MinimizedPetCard from "../components/MinimizedPetCard";
import NoPets from "../components/NoPets";
import { usePetContext } from "../contexts/PetContext";

const Item = styled(Paper)(({ theme }) => ({
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
}));

const SearchPage = () => {
    const { petsList } = usePetContext();

    return (
        <Box sx={{
            flexGrow: 1, margin: 3,
        }}>
            {
                petsList.length ?
                    <Grid container spacing={2}>
                        {petsList.map((pet) =>
                            <Grid item xs={3} key={pet._id}>
                                <Item><MinimizedPetCard pet={pet} /></Item>
                            </Grid>
                        )}
                    </Grid>
                    :
                    <Card sx={{ minWidth: 275, p: 3 }}>
                        <CardContent sx={{ p: '0 !important' }}>
                            <NoPets />
                        </CardContent>
                    </Card>
            }
        </Box>
    );
}

export default SearchPage;