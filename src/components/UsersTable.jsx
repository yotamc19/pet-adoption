import * as React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Button, CircularProgress, Popover } from '@mui/material';
import { useDashboardContext } from '../contexts/DashboardContext';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { useState } from 'react';

const headCells = [
    {
        id: 'email',
        numeric: false,
        disablePadding: true,
        label: 'Email',
    },
    {
        id: 'name',
        numeric: false,
        disablePadding: false,
        label: 'Name',
    },
    {
        id: 'phoneNumber',
        numeric: false,
        disablePadding: false,
        label: 'Phone number',
    },
    {
        id: 'isAdmin',
        numeric: false,
        disablePadding: false,
        label: 'Admin',
    },
];

function EnhancedTableHead(props) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align='left'
                        padding='normal'
                    >
                        {headCell.label}
                    </TableCell>
                ))}
                <TableCell
                    align='left'
                    padding='normal'
                >
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
    const { usersList, setUsersList } = useDashboardContext();
    const { loggedUser } = useAuthContext();

    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);
    const [ownedPets, setOwnedPets] = useState([]);
    const [showLoader, setShowLoader] = useState(true);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersList.length) : 0;

    const handleMakeAdmin = async (e, id, flag) => {
        e.stopPropagation();
        await axios.put(`${process.env.REACT_APP_SERVER_URL}/user/${id}`, { isAdmin: !flag }, { withCredentials: true });
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, { withCredentials: true });
        const finalList = res.data.filter(u => u._id !== loggedUser._id);
        setUsersList(finalList);
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/user/${id}/delete-user`, { withCredentials: true });
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, { withCredentials: true });
            const finalList = res.data.filter(u => u._id !== loggedUser._id);
            setUsersList(finalList);
        } catch (err) {
            console.log(err);
        }
    }

    const open = Boolean(anchorEl);

    const handleRowClick = async (e, id) => {
        try {
            setAnchorEl(e.currentTarget);
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet/user/${id}`);
            setOwnedPets(res.data);
            setShowLoader(false);
        } catch (err) {
            console.log(err);
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
        setShowLoader(true);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%' }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size='medium'
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            rowCount={usersList.length}
                        />
                        <TableBody>
                            {usersList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row._id}
                                            onClick={(e) => { handleRowClick(e, row._id) }}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.email}
                                            </TableCell>
                                            <TableCell align="left" >{row.firstName + ' ' + row.lastName}</TableCell>
                                            <TableCell align="left" >{row.phoneNumber}</TableCell>
                                            <TableCell align="left" >{row.isAdmin ? 'Yes' : 'No'}</TableCell>
                                            <TableCell align="left">
                                                {
                                                    row.isAdmin ?
                                                        <Button variant='outlined' sx={{ marginRight: 2 }} onClick={(e) => { handleMakeAdmin(e, row._id, true) }}>Remove admin</Button>
                                                        :
                                                        <Button variant='outlined' sx={{ marginRight: 2 }} onClick={(e) => { handleMakeAdmin(e, row._id, false) }}>Make admin</Button>
                                                }
                                                <Button variant='outlined' onClick={(e) => { handleDelete(e, row._id) }}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            <Popover
                                id='userPets'
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography sx={{ p: 2 }}>Owned pets by user:</Typography>
                                {
                                    showLoader ?
                                        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
                                            <CircularProgress />
                                        </Box>
                                        :
                                        ownedPets.length ?
                                            <>
                                                {
                                                    ownedPets.map(p => <Typography key={p._id} sx={{ p: 2 }}>{p.name}: {p.adopStatus}</Typography>)
                                                }
                                            </>
                                            :
                                            <Typography sx={{ p: 2 }}>No pets to see here</Typography>
                                }
                            </Popover>
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={usersList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage} />
            </Paper>
        </Box >
    );
}