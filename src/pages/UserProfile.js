import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Layout from '../components/Layout';
import LinkIcon from '@mui/icons-material/Link';
import { createClient } from '@supabase/supabase-js';
import StorefrontIcon from '@mui/icons-material/Storefront';


const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const UserProfile = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [markets, setMarkets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const loans = ['Loan 1', 'Loan 2', 'Loan 3'];

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);

      async function fetchTransactions() {
        const response = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${window.ethereum.selectedAddress}&startblock=0&endblock=99999999&sort=desc&apikey=WWBV5YZQMI2D6X21TYZU919PVZ9IY35PH4`);
        const data = await response.json();

        if (data.result) {
          // Truncate the hash to 10 characters
          const truncatedTransactions = data.result.slice(0, 3).map(transaction => ({
            ...transaction,
            hash: `${transaction.hash.substring(0, 30)}...`
          }));
          setTransactions(truncatedTransactions);
        }
      }

      fetchTransactions();
    }

    if (supabase && walletAddress) {
      async function fetchMarkets() {
        const { data, error } = await supabase
          .from('Markets')
          .select("*")
          .ilike('owner', walletAddress);

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
      <Container style={{ paddingTop: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">User Profile</Typography>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
              <Typography variant="h5" style={{ color: 'white', marginBottom: '1rem' }}>Owner Address</Typography>
              <Typography variant="body1" style={{ marginBottom: '1rem', color: 'white' }}>
                Wallet Address: {walletAddress}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '1rem', color: 'white' }}>
                Networks: Ethereum, Binance Smart Chain, etc.
              </Typography>
              {walletAddress && (
                <Button
                  variant="contained"
                  color="primary"
                  component="a"
                  href={`https://goerli.etherscan.io/address/${walletAddress}`}
                  target="_blank"
                >
                  View on Goerli Etherscan
                </Button>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: '#f0f0f0' }}>
              <Typography variant="h5">Previous Transactions</Typography>
              <List>
                {transactions.map((transaction, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <LinkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <a
                          href={`https://goerli.etherscan.io/tx/${transaction.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {transaction.hash}
                        </a>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: '#f0f0f0', minHeight: '100%' }}>
              <Typography variant="h5">Loans</Typography>
              <ul style={{ paddingLeft: '1rem', marginTop: '1rem' }}>
                {loans.map((loan, index) => (
                  <li key={index}>{loan}</li>
                ))}
              </ul>
            </Paper>
          </Grid>


          <Grid item xs={12}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: '#f0f0f0' }}>
              <Typography variant="h5">Markets Created</Typography>
              <ul style={{ paddingLeft: '1rem', marginTop: '1rem' }}>
                {markets.map((market, index) => (
                  <div key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <StorefrontIcon style={{ marginRight: '0.5rem' }} />
                      </ListItemIcon>
                      <ListItemText primary={market.name} secondary={market.description} />
                      <Button variant="outlined" color="secondary">
                        Cancel Market
                      </Button>
                    </ListItem>

                    <hr style={{ borderTop: '1px solid #ccc', marginTop: '1rem', marginBottom: '1rem' }} />
                  </div>
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
