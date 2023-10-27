import React, { useState } from 'react';
import { Button } from '@mui/material';

const RoundedButton = ({ label }) => {
  const [isHovered, setHovered] = useState(false);

  const buttonStyle = {
    borderRadius: '50%', // Make the button round
    width: '50px', // Set the button's width
    height: '50px', // Set the button's height
    backgroundColor: isHovered ? 'blue' : 'black', // Set the button color to black
    transition: 'background-color 0.3s',
    color: 'white', // Set the text color to white
  };

  return (
    <Button
      style={buttonStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Button>
  );
};

export default RoundedButton;
