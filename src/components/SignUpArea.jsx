import React from 'react';
import { Paper, Typography, Stack, Container, CssBaseline } from '@mui/material';
import RoundedButton from './RoundedButton'; // Import the RoundedButton component

const StepCard = ({ stepNumber, title, description }) => (
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
        backgroundColor: 'white', // Set background color to white
        padding: '20px',
        margin: '10px 0 50px', // Add a larger margin to create more space
        display: 'flex',
        flexDirection: 'column', // Adjust layout to column direction
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
                    stepNumber={1}
                    title="Create Your Wallet"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quos consectetur tidio."
                />
                <RoundedButton label="2" />
                <StepCard
                    stepNumber={2}
                    title="Make Payment"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quos consectetur tidio."
                />
                <RoundedButton label="3" />
                <StepCard
                    stepNumber={3}
                    title="Buy & Sell Coins"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quos consectetur tidio."
                />
            </Stack>
        </Container>
    );
};

export default SignUpArea;