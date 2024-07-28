import * as React from 'react';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#ff6d75',
  },
  '& .MuiRating-iconHover': {
    color: '#ff3d47',
  },
  '& .MuiRating-icon': {
    fontSize: '1.8em', // Increase the size of the hearts
  },
});

const CustomTypography = styled(Typography)({
  fontSize: '0.8em', // Increase the size of the text
});

export default function CustomRating() {
  return (
    <div>
      <CustomTypography component="legend">Did you enjoy our website?</CustomTypography>
      <StyledRating
        name="customized-color"
        defaultValue={5}
        getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
    </div>
  );
}
