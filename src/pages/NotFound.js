import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import Layout from '../components/Layout';

const NotFound = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
  };

  const headingStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'darkred',
  };

  const paragraphStyle = {
    fontSize: '18px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
  };

  return (
    <Layout>
      <Container maxWidth="md" style={containerStyle}>
        <Typography variant="h1" align="center" style={headingStyle}>
          404 - Not Found
        </Typography>
        <Typography variant="body1" align="center" style={paragraphStyle}>
          The page you are looking for might be in another castle.
        </Typography>
        <Button component={Link} to="/" variant="contained" style={buttonStyle}>
          Go Back Home
        </Button>
      </Container>
    </Layout>
  );
};

export default NotFound;
