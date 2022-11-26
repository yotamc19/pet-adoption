import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePetContext } from '../contexts/PetContext';

export default function MinimizedPetCard({ pet }) {
  const { setCurrentPet } = usePetContext();
  const navigate = useNavigate();

  const handleMoreDetails = () => {
    setCurrentPet(pet);
    navigate(`/pet/${pet._id}`);
  }

  return (
    <Card sx={{ width: '100% !important', boxShadow: 0 }}>
      <CardActionArea className='w-100'>
        <img className='cardImg' src={pet.img} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pet.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pet.adopStatus}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button size="small" color="primary" onClick={handleMoreDetails}>
          More details
        </Button>
      </CardActions>
    </Card>
  );
}