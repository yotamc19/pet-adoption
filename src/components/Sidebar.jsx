import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSidebarContext } from '../contexts/SidebarContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from "axios";
import { usePetContext } from '../contexts/PetContext';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useDashboardContext } from '../contexts/DashboardContext';
import { useAddPetContext } from '../contexts/AddPetContext';

export default function TemporaryDrawer() {
    const { sidebarStatus, toggleSidebar } = useSidebarContext();
    const { loggedUser, toggleShowAlert, changeLoggedUser } = useAuthContext();
    const { setPetsList, setSavedPets } = usePetContext();
    const { setUpdateMode, setValues } = useAddPetContext();
    const { setUsersList } = useDashboardContext();

    const handleHomeClick = () => {
        toggleShowAlert(false);
        toggleSidebar(false);
    }

    const handleMyPetsClick = async () => {
        let list = [];
        try {
            const ownedPets = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet/user/${loggedUser._id}`, { withCredentials: true });
            list = ownedPets.data;

            const currentUser = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/${loggedUser._id}`);
            changeLoggedUser(currentUser.data);
            setSavedPets(currentUser.data.savedPets)
        } catch (err) {
            console.log(err);
        }
        setPetsList(list);
        toggleSidebar(false);
        toggleShowAlert(false);
    }

    const handleDashboardClick = async () => {
        toggleShowAlert(false);
        toggleSidebar(false);
        const allPets = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet`, { withCredentials: true });
        setPetsList(allPets.data);
        const usersRes = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, { withCredentials: true });
        const allUsers = usersRes.data.filter(u => u._id !== loggedUser._id);
        setUsersList(allUsers);
    }

    const handleAddPetClick = () => {
        toggleShowAlert(false);
        toggleSidebar(false);
        setUpdateMode(false);
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
    }

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/profile' onClick={handleHomeClick}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={loggedUser.firstName} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            {
                loggedUser.isAdmin ?
                    <>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to='/dashboard' onClick={handleDashboardClick}>
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Dashboard' />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton component={Link} to='/add-pet' onClick={handleAddPetClick}>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Add Pet' />
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <Divider />
                    </>
                    : ''
            }
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/' onClick={() => { toggleSidebar(false) }}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary='Home' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to='/myPets' onClick={handleMyPetsClick}>
                        <ListItemIcon>
                            <PetsIcon />
                        </ListItemIcon>
                        <ListItemText primary='My Pets' />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box >
    );

    return (
        <Drawer
            open={sidebarStatus}
            onClose={() => { toggleSidebar(false) }}
        >
            {list()}
        </Drawer>
    );
}