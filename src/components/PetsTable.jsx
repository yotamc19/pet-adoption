import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { usePetContext } from '../contexts/PetContext';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAddPetContext } from '../contexts/AddPetContext';

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'type',
        numeric: false,
        disablePadding: false,
        label: 'Type',
    },
    {
        id: 'breed',
        numeric: false,
        disablePadding: false,
        label: 'Breed',
    },
    {
        id: 'color',
        numeric: false,
        disablePadding: false,
        label: 'Color',
    },
    {
        id: 'adopStatus',
        numeric: false,
        disablePadding: false,
        label: 'Adoption Status',
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
    const { petsList, setPetsList } = usePetContext();
    const { setValues, setUpdateMode, setUpdatedPetId } = useAddPetContext();
    const navigate = useNavigate();
    
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - petsList.length) : 0;

    const handleEdit = async (id) => {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet/${id}`);
        const data = res.data[0];
        setUpdatedPetId(data._id);
        const pet = {
            name: data.name,
            type: data.type,
            color: data.color,
            breed: data.breed,
            weight: data.weight,
            height: data.height,
            hypo: data.hypo,
            dietery: data.dietery.join(' '),
            bio: data.bio,
        }
        setValues(pet);
        setUpdateMode(true);
        navigate(`/add-pet`); 
    }

    const handleDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pet/${id}/delete-pet`, { data: { id }, withCredentials: true });
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pet`, { withCredentials: true });
        setPetsList(res.data);
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
                            rowCount={petsList.length}
                        />
                        <TableBody>
                            {petsList
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row._id}
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="left">{row.type}</TableCell>
                                            <TableCell align="left">{row.breed}</TableCell>
                                            <TableCell align="left">{row.color}</TableCell>
                                            <TableCell align="left">{row.adopStatus ? row.adopStatus : 'Needs a home'}</TableCell>
                                            <TableCell align="left">
                                                <Button variant='outlined' onClick={() => { handleEdit(row._id) }} sx={{ marginRight: 2 }}>Edit</Button>
                                                <Button variant='outlined' onClick={() => { handleDelete(row._id) }}>Delete</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                    count={petsList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}