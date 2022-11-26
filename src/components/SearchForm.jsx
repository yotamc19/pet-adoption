import * as React from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import { Card, CardActions, CardContent, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchContext } from '../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { usePetContext } from '../contexts/PetContext';
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export default function BasicPopover() {
    const { search, changeSearch } = useSearchContext();
    const { toggleShowAlert } = useAuthContext();
    const { setPetsList } = usePetContext();
    const navigate = useNavigate();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [isSearchAdvanced, setIsSearchAdvanced] = useState(false);

    const handleChange = (e) => {
        changeSearch({
            ...search,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = async () => {
        toggleShowAlert(false);
        handleClose();
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet/search?type=${search.type}&name=${search.name}&adopStatus=${search.adopStatus}&minHeight=${search.minHeight}&minWeight=${search.minWeight}`, { withCredentials: true });
        setPetsList(res.data);
        navigate(`/search`);
    }

    const handleSearchStatusChange = () => {
        if (isSearchAdvanced) {
            changeSearch({ 
                type: search.type, 
                name: '', 
                adopStatus: '', 
                minHeight: '', 
                minWeight: '', 
            });
        }
        setIsSearchAdvanced(!isSearchAdvanced);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <IconButton onClick={handleClick}>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Card sx={{ width: '400px' }}>
                    <CardContent>
                        <div className='m-2'>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={search.type}
                                    label='type'
                                    name="type"
                                    onChange={handleChange}
                                >
                                    <MenuItem value='Dog'>Dog</MenuItem>
                                    <MenuItem value='Cat'>Cat</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        {
                            isSearchAdvanced
                                ?
                                <>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <TextField id="outlined-basic" label="Name" name='name' value={search.name} onChange={handleChange} variant="outlined" sx={{ m: 1 }} />
                                        <FormControl fullWidth sx={{ m: 1 }}>
                                            <InputLabel id="demo-simple-select-label">Adoption status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={search.adopStatus}
                                                label="adoption status"
                                                name='adopStatus'
                                                onChange={handleChange}
                                            >
                                                <MenuItem value='Still here'>Still here</MenuItem>
                                                <MenuItem value='Fostered'>Fostered</MenuItem>
                                                <MenuItem value='Adopted'>Adopted</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <TextField
                                            label="Min Weight"
                                            name='minWeight'
                                            value={search.minWeight}
                                            onChange={handleChange}
                                            id="outlined-start-adornment"
                                            sx={{ m: 1 }}
                                            type='number'
                                            InputProps={{
                                                inputProps: { min: 1 },
                                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                            }}
                                        />
                                        <TextField
                                            label="Min Height"
                                            name='minHeight'
                                            value={search.minHeight}
                                            onChange={handleChange}
                                            id="outlined-start-adornment"
                                            sx={{ m: 1 }}
                                            type='number'
                                            InputProps={{
                                                inputProps: { min: 1 },
                                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                            }}
                                        />
                                    </div>
                                </>
                                :
                                ''
                        }
                    </CardContent>
                    <div className='d-flex align-items-center justify-content-between m-4 my-2'>
                        <FormControlLabel control={<Switch checked={isSearchAdvanced} onChange={handleSearchStatusChange} />} label="Advanced search" />
                        <CardActions>
                            <Button variant='contained' size="small" onClick={handleSearch}>Search</Button>
                        </CardActions>
                    </div>
                </Card>
            </Popover>
        </div>
    );
}
