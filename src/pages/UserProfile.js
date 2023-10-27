import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Layout from '../components/Layout';
import LinkIcon from '@mui/icons-material/Link';
import { createClient } from '@supabase/supabase-js';
import StorefrontIcon from '@mui/icons-material/Storefront';
import contractABI from "../ABIs/marketRegistery.json";
import { ethers } from "ethers";

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const UserProfile = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [markets, setMarkets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const loans = ['Loan 1', 'Loan 2', 'Loan 3'];
  const [openMarkets, setOpenMarkets] = useState([]);
  const [closedMarkets, setClosedMarkets] = useState([]);

  async function initWeb3() {
    try {
      await window.ethereum.enable();
    } catch (error) {
      console.error('User denied access to their wallet or an error occurred:', error);
    }
  }

  async function closeMarket(marketID, name, description, owner) {
    try {
      const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';

      const marketIDAsNumber = parseInt(marketID);

      if (isNaN(marketIDAsNumber)) {
        console.error('Invalid marketID. Please provide a valid number.');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const txResponse = await contract.closeMarket(marketIDAsNumber);

      await txResponse.wait();
      console.log('Transaction hash:', txResponse.hash);
      console.log('Transaction confirmed in block:', txResponse.blockNumber);

      const { data, error } = await supabase
        .from('Markets')
        .upsert([
          {
            id: marketID,
            name: name,
            description: description,
            owner: owner,
            isClosed: true,
          },
        ]);

      if (error) {
        console.error('Error updating Supabase table:', error);
      }
    } catch (error) {
      console.error('Error calling closeMarket:', error);
    }
  }

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);

      async function fetchTransactions() {
        const response = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${window.ethereum.selectedAddress}&startblock=0&endblock=99999999&sort=desc&apikey=UXWX37Y2Y4PQM8ZZ1XQ2KBWH6AVZ8J7RYU`);
        const data = await response.json();

        if (data.result) {
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

          const open = data.filter((market) => !market.isClosed);
          const closed = data.filter((market) => market.isClosed);

          setOpenMarkets(open);
          setClosedMarkets(closed);
        } else if (error) {
          console.error('Error fetching markets:', error);
        }
      }

      fetchMarkets();
    }
  }, [supabase, walletAddress]);

  return (
    <Layout>
      <Container style={{ paddingTop: '9rem', paddingBottom: '7rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <Typography variant="h4">User Profile</Typography> */}
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
              <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}> <strong>Owner Address: {walletAddress}</strong></Typography>
              
              {/* <Typography variant="body1" style={{ marginBottom: '1rem', color: 'white' }}>
                <strong>Wallet Address: {walletAddress}</strong>
              </Typography> */}

              <Typography variant="body1" style={{ marginBottom: '1rem', color: 'white' }}>
                <strong>Network:</strong> <strong>Ethereum</strong>
              </Typography>


              {walletAddress && (
                <Button
                  variant="contained"
                  style={{
                    borderRadius: '50px',
                    transition: 'background-color 0.3s',
                    background: 'linear-gradient(to right, ##0033cc 0%, #ff99cc 100%)', // Corrected the background property
                  }}
                  href={`https://goerli.etherscan.io/address/${walletAddress}`}
                  target="_blank"
                >
                  View on Etherscan
                </Button>
              )}





            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: '#f0f0f0', minHeight: '100%' }}>
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
                {/* {loans.map((loan, index) => (
                  <li key={index}>{loan}</li>
                ))} */}
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: '#f0f0f0', minHeight: '100%' }}>
              <Typography variant="h5">Open Markets</Typography>
              <ul style={{ paddingLeft: '1rem', marginTop: '1rem' }}>
                {openMarkets.map((market, index) => (
                  <div key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <StorefrontIcon style={{ marginRight: '0.5rem' }} />
                      </ListItemIcon>
                      <ListItemText primary={market.name} secondary={market.description} />
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => closeMarket(market.id, market.name, market.description, market.owner)}
                      >
                        Close Market
                      </Button>
                    </ListItem>
                    <hr style={{ borderTop: '1px solid #ccc', marginTop: '1rem', marginBottom: '1rem' }} />
                  </div>
                ))}
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={6} style={{ padding: '2rem', borderRadius: '16px', background: '#f0f0f0', minHeight: '100%' }}>
              <Typography variant="h5">Closed Markets</Typography>
              <ul style={{ paddingLeft: '1rem', marginTop: '1rem' }}>
                {closedMarkets.map((market, index) => (
                  <div key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <StorefrontIcon style={{ marginRight: '0.5rem' }} />
                      </ListItemIcon>
                      <ListItemText primary={market.name} secondary={market.description} />
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
