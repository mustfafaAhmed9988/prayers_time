import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function PrayerCard({name,time,url}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={url}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
            <span className="font"> {name} </span>
          
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <span className="font"> {time} </span>
        </Typography>
      </CardContent>

    </Card>
  );
}