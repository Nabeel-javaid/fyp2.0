import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use your preferred routing library
import { Container, Grid, Typography, Paper, Button } from '@mui/material';
import Layout from '../components/Layout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const UserProfile = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [markets, setMarkets] = useState([]);
  const previousTransactions = ['Transaction 1', 'Transaction 2', 'Transaction 3'];
  const loans = ['Loan 1', 'Loan 2', 'Loan 3'];
//   const markets = ['Market 1', 'Market 2', 'Market 3'];

  useEffect(() => {

    // console.log("Game")
    // Check if Ethereum provider is available and the user is connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
    }

    if (supabase && walletAddress) {
      console.log(walletAddress)
        async function fetchMarkets() {
          const { data, error } = await supabase
            .from('Markets')
            .select("*")
            .ilike('owner', walletAddress);

            console.log(data);
  
          if (data) {
            setMarkets(data);
          } else if (error) {
            console.error('Error fetching markets:', error);
          }
        }
  
        fetchMarkets();
    }
  }, [supabase, walletAddress]);

  return (
    <Layout>
        <Container style={{ paddingTop: '10rem' }}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <Typography variant="h4">User Profile</Typography>
            </Grid>

            {/* Owner Address Section */}
            <Grid item xs={12}>
            <Paper>
                <Typography variant="h5">Owner Address</Typography>
                <Typography variant="body1">
                Wallet Address: {walletAddress}
                </Typography>
                <Typography variant="body1">
                Networks: Ethereum, Binance Smart Chain, etc.
                </Typography>
                {walletAddress && (
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`https://etherscan.io/address/${walletAddress}`}
                >
                    View on Etherscan
                </Button>
                )}
            </Paper>
            </Grid>

            {/* Previous Transactions Section */}
            <Grid item xs={12}>
            <Paper>
                <Typography variant="h5">Previous Transactions</Typography>
                <ul>
                {previousTransactions.map((transaction, index) => (
                    <li key={index}>{transaction}</li>
                ))}
                </ul>
            </Paper>
            </Grid>

            {/* Loans Section */}
            <Grid item xs={12}>
            <Paper>
                <Typography variant="h5">Loans</Typography>
                <ul>
                {loans.map((loan, index) => (
                    <li key={index}>{loan}</li>
                ))}
                </ul>
            </Paper>
            </Grid>

            {/* Markets Created Section */}
            <Grid item xs={12}>
            <Paper>
                <Typography variant="h5">Markets Created</Typography>
                <ul>
                {markets.map((market, index) => (
                  <>
                    <li key={index}>{market.name}</li>
                    <li key={index}>{market.description}</li>
                    </>
                ))}
                </ul>
            </Paper>
            </Grid>
        </Grid>
        </Container>
    </Layout>
  );
};

export default UserProfile;
