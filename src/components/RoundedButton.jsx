import React, { useState } from 'react';
import { Button } from '@mui/material';

const RoundedButton = ({ label }) => {
  const [isHovered, setHovered] = useState(false);

  const buttonStyle = {
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    backgroundColor: isHovered ? 'blue' : 'black',
    transition: 'background-color 0.3s',
    color: 'white',
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

export default React.memo(RoundedButton);