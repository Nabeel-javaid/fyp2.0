import React from 'react';
import { Paper, Typography, Stack, Container, CssBaseline } from '@mui/material';
import RoundedButton from './RoundedButton';

const StepCard = ({ title, description }) => (
  <Paper elevation={0} style={{ padding: '20px', margin: '10px', backgroundColor: 'transparent', border: 'none' }}>
    <Typography variant="h6" align="center">
      {title}
    </Typography>
    <Typography variant="body1" align="center" style={{ marginTop: '10px' }}>
      {description}
    </Typography>
  </Paper>
);

const SignUpArea = () => {
  const containerStyle = {
    backgroundColor: 'white',
    padding: '20px',
    margin: '10px 0 50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const headingStyle = {
    color: 'lightblue',
    fontSize: '24px',
  };

  const subheadingStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  return (
    <Container maxWidth={false} style={containerStyle}>
      <CssBaseline />
      <Typography variant="h4" align="center" style={headingStyle}>
        Ready To Get Started
      </Typography>
      <Typography variant="h5" align="center" style={subheadingStyle}>
        3 Steps To Start
      </Typography>
      <Stack direction="row" justifyContent="center" alignItems="center">
        <RoundedButton label="1" />
        <StepCard
          title="Create Your Wallet"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quos consectetur tidio."
        />
        <RoundedButton label="2" />
        <StepCard
          title="Make Payment"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quos consectetur tidio."
        />
        <RoundedButton label="3" />
        <StepCard
          title="Buy & Sell Coins"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quos consectetur tidio."
        />
      </Stack>
    </Container>
  );
};

export default React.memo(SignUpArea);