import { Typography } from "@mui/material";

const NoPets = () => {
    return (
        <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', m: 2 }}
        >
            No pets to see here 🙈
        </Typography>
    );
}

export default NoPets;