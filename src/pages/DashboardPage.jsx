import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Card, CardContent, CircularProgress, Stack, Switch, Typography } from '@mui/material';
import { usePetContext } from '../contexts/PetContext';
import PetsTable from '../components/PetsTable';
import UsersTable from '../components/UsersTable';
import { styled } from '@mui/material/styles';
import { useDashboardContext } from '../contexts/DashboardContext';
import axios from 'axios';
import { useAuthContext } from '../contexts/AuthContext';
import { useSidebarContext } from '../contexts/SidebarContext';

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

export default function DeashboardPage() {
    const { showPetsList, setShowPetsList, usersList, setUsersList } = useDashboardContext();
    const { petsList, setPetsList } = usePetContext();
    const { toggleSidebar } = useSidebarContext();
    const { toggleShowAlert } = useAuthContext();

    React.useEffect(() => {
        const init = async () => {
            const cookies = document.cookie.split(' ');
            let email = '';
            cookies.map(cookie => {
                if (cookie.includes('email')) {
                    email = cookie.substring(6).replace('%40', '@');
                }
            })

            toggleShowAlert(false);
            toggleSidebar(false);
            const allPets = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet`, { withCredentials: true });
            setPetsList(allPets.data);
            const usersRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, { withCredentials: true });
            const allUsers = usersRes.data.filter(u => u.email !== email);
            setUsersList(allUsers);
        }
        init();
    }, []);

    const handleChange = () => {
        setShowPetsList(!showPetsList);
    }

    return (
        <Box sx={{
            flexGrow: 1, margin: 3,
        }}>
            <Card sx={{ minWidth: 275, p: 3 }}>
                <CardContent sx={{ p: '0 !important' }}>
                    {
                        usersList.length ?
                            <>
                                <div className='d-flex justify-content-around mb-3'>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography>Users</Typography>
                                        <AntSwitch checked={showPetsList} inputProps={{ 'aria-label': 'ant design' }} onChange={handleChange} />
                                        <Typography>Pets</Typography>
                                    </Stack>
                                    <Typography variant='h6'>Total {showPetsList ? 'pets' : 'users'}: {showPetsList ? petsList.length : usersList.length}</Typography>
                                </div>
                                <Grid container>
                                    {
                                        showPetsList ?
                                            <PetsTable />
                                            :
                                            <UsersTable />
                                    }
                                </Grid>
                            </>
                            :
                            <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                                <CircularProgress />
                            </Box>
                    }
                </CardContent>
            </Card>
        </Box>
    );
}