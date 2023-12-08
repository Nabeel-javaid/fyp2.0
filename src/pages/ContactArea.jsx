import React from 'react';
import { Box, Typography } from '@mui/material';
import '../css/ContactArea.css'; // Import a CSS file for styling (if needed)

const ContactArea = () => {
  return (
    <Box
      className="contact-area" // Add a class name for styling
      backgroundColor= "#197D62"
      padding="10px"
      width="500px" // Adjust the width as needed
      marginLeft="20px"
      borderRadius="5px"
      boxShadow="0px 0px 5px 0px rgba(0,0,0,0.5)"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography
  variant="body1"
  className="bouncing-text"
  style={{
    position: 'relative',
    top: '-135px', // Adjust the top value to position the text above
    fontSize: '40px',
    fontWeight: 'bold',
  }}
>
 Make the Loan according to your desires!
</Typography>
    </Box>
  );
};

export default ContactArea;
