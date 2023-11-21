import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, Button, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import Layout from '../components/Layout';
import LinkIcon from '@mui/icons-material/Link';
import { createClient } from '@supabase/supabase-js';
import StorefrontIcon from '@mui/icons-material/Storefront';
import contractABI from "../ABIs/marketRegistery.json";
import { ethers } from "ethers";
import userImage from '../avatar.jpg';
import Moralis from 'moralis';


const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;
const etherscanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);

const UserProfile = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [openMarkets, setOpenMarkets] = useState([]);
  const [closedMarkets, setClosedMarkets] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState('');

  const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
  const provider = new ethers.providers.Web3Provider(window.ethereum);





  async function closeMarket(marketID) {
    try {

      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const txResponse = await contract.closeMarket(marketID);

      await txResponse.wait();
      console.log('Transaction hash:', txResponse.hash);
      console.log('Transaction confirmed in block:', txResponse.blockNumber);


      // Trigger re-render by fetching updated markets
      fetchMarkets();
    } catch (error) {
      console.error('Error calling closeMarket:', error.message);
    }
  }

  async function isMarketOpen(marketID) {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
      const isOpen = await contract.isMarketOpen(marketID);
      console.log(isOpen);
      return isOpen;
    } catch (error) {
      console.error('Error calling isMarketOpen:', error.message);
      return false;
    }
  }


  async function fetchMarkets() {
    try {
      const { data, error } = await supabase
        .from('Markets')
        .select("*")
        .ilike('owner', walletAddress);

      if (error) {
        throw new Error(`Error fetching markets: ${error.message}`);
      }

      if (data) {
        console.log("data from supabase")
        const markets = data.map(async market => {
          const isOpen = await isMarketOpen(market.id);
          return {
            ...market,
            isOpen
          };
        });

        Promise.all(markets).then(updatedMarkets => {
          const open = updatedMarkets.filter(market => market.isOpen);
          const closed = updatedMarkets.filter(market => !market.isOpen);

          setOpenMarkets(open);
          setClosedMarkets(closed);
        });
      }
    } catch (error) {
      console.error('Error fetching markets:', error.message);
    }
  }


  function getWalletAddress() {
    const address = window.ethereum.selectedAddress;
    console.log('Wallet address:', address);
    setWalletAddress(address);
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call getWalletAddress and wait for it to complete
        await getWalletAddress();

        // Make sure walletAddress is not null before proceeding
        if (!walletAddress) {
          return;
        }

        // Fetch transactions
        const response = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`);
        const data = await response.json();

        if (data.result) {
          const truncatedTransactions = data.result.slice(0, 3).map(transaction => ({
            ...transaction,
            hash: `${transaction.hash.substring(0, 30)}...`
          }));
          setTransactions(truncatedTransactions);
        }

        await checkENS(walletAddress);

        if (supabase && walletAddress) {
          await fetchMarkets();
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    // Call fetchData inside the useEffect
    fetchData();
  }, [supabase, walletAddress]);





  async function checkENS(walletAddressToCheck) {
    try {
      await Moralis.start({
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjcxNWQ1ZjQxLTU4ODktNGJjNS04ZjFiLWYwNzlkOWFmY2JlNCIsIm9yZ0lkIjoiMzYyMjkwIiwidXNlcklkIjoiMzcyMzQwIiwidHlwZUlkIjoiYzE4ZmYxMGUtNjkzZS00YzM0LTllOGQtMjU5MWYyM2M0ZmY5IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgzMDY2NzUsImV4cCI6NDg1NDA2NjY3NX0.bPp49P1rhPiuVHl5jJ2LnHc69dSEcsjYtznsxyStUMg",
      });

      const response = await Moralis.EvmApi.resolve.resolveAddress({
        "address": walletAddressToCheck,
      });

      const ensName = response.raw.name;

      if (ensName) {
        setOwnerAddress(ensName);
      }
    } catch (e) {
      console.error(e.message);
    }
  }



  return (
    <Layout>
      <Container style={{ paddingTop: '9rem', paddingBottom: '7rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <Typography variant="h4">User Profile</Typography> */}
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={6} style={{ position: 'relative', padding: '2rem', borderRadius: '16px', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
              <img
                src={userImage}
                alt="User"
                style={{
                  position: 'absolute',
                  top: '2.5rem',
                  left: '63rem',
                  width: '100px',
                  height: '100px'
                }}
              />
              <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}>
                <strong>Owner: {ownerAddress || walletAddress}</strong>
              </Typography>

              <Typography variant="body1" style={{ marginBottom: '1rem', color: 'white' }}>
                <strong>Network:</strong> <strong>Ethereum</strong>
              </Typography>

              {walletAddress && (
                <Button
                  variant="outlined"
                  color="secondary"
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
                      {console.log("market open")}
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => closeMarket(market.id)}
                      >
                        Close Market
                      </Button>
                    </ListItem>
                    <hr style={{ borderTop: '3px solid #ccc', marginTop: '1rem', marginBottom: '1rem' }} />
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
                      {console.log("market closed")}
                    </ListItem>
                    <hr style={{ borderTop: '3px solid #ccc', marginTop: '1rem', marginBottom: '1rem' }} />
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
