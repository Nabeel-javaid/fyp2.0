import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, Button, Button as MUIButton, List, ListItem, ListItemText, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Layout from '../components/Layout';
import LinkIcon from '@mui/icons-material/Link';
import { createClient } from '@supabase/supabase-js';
import StorefrontIcon from '@mui/icons-material/Storefront';
import contractABI from "../ABIs/marketRegistery.json";
import { ethers } from "ethers";
import ScaleLoader from 'react-spinners/ScaleLoader';
import { Alchemy, Network } from "alchemy-sdk";


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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [MID, setMID] = useState('');
  const [loading, setLoading] = useState(false);

  const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function closeMarket(marketID) {
    setMID(marketID);
    setCancelDialogOpen(true);
  }

  async function isMarketOpen(marketID) {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    try {
      const isOpen = await contract.isMarketOpen(marketID);
      return isOpen;
    } catch (error) {
      console.error('Error calling isMarketOpen:', error.message);
      return false;
    }
  }

  const fetchMarkets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Markets')
        .select("*")
        .ilike('owner', walletAddress);

      if (error) {
        throw new Error(`Error fetching markets: ${error.message}`);
      }

      if (data) {
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
    } finally {
      setLoading(false);
    }
  };

  function getWalletAddress() {
    const address = window.ethereum.selectedAddress;
    console.log('Wallet address:', address);
    setWalletAddress(address);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getWalletAddress();

        if (!walletAddress) {
          return;
        }

        checkENS(walletAddress);

        const response = await fetch(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`);
        const data = await response.json();

        if (data.result) {
          const truncatedTransactions = data.result.slice(0, 3).map(transaction => ({
            ...transaction,
            hash: `${transaction.hash.substring(0, 30)}...`
          }));
          setTransactions(truncatedTransactions);
        }

        if (supabase && walletAddress) {
          await fetchMarkets();
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [supabase, walletAddress]);

  async function checkENS(walletAddressToCheck) {
    try {
      const config = {
        apiKey: "owPQ3CAm4xkJ7gukesUl4w7iqUpNHVIb",
        network: Network.ETH_MAINNET,
      };
      const alchemy = new Alchemy(config);
      
      const ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
      const nfts = await alchemy.nft.getNftsForOwner(walletAddressToCheck, {
        contractAddresses: [ensContractAddress],
      });
      
      console.log("nfts", nfts.ownedNfts[0].name);


      if (nfts) {
        setOwnerAddress(nfts.ownedNfts[0].name);
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  const handleCancelCancel = () => {
    setCancelDialogOpen(false);
  };

  const handleCancelConfirm = async (marketID) => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Move setLoading inside the try block
      setLoading(true);

      const txResponse = await contract.closeMarket(marketID);

      await txResponse.wait();
      console.log('Transaction hash:', txResponse.hash);
      console.log('Transaction confirmed in block:', txResponse.blockNumber);

      const { error } = await supabase
        .from('Markets')
        .update({ isClosed: true })
        .eq('id', marketID);

      fetchMarkets();
    } catch (error) {
      console.error('Error calling closeMarket:', error.message);
      // You might want to show an error message to the user or handle it appropriately
    } finally {
      // Move setLoading inside the finally block
      setLoading(false);
      setCancelDialogOpen(false);
    }
  };

  return (
    <Layout>
      <Container style={{ paddingTop: '9rem', paddingBottom: '7rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={6} style={{ position: 'relative', padding: '2rem', borderRadius: '16px', background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
              <img
                src="https://i.ibb.co/DL3dtSj/avatar2-0.png"
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
                    </ListItem>
                    <hr style={{ borderTop: '3px solid #ccc', marginTop: '1rem', marginBottom: '1rem' }} />
                  </div>
                ))}
              </ul>
            </Paper>
          </Grid>

          <Dialog open={cancelDialogOpen} onClose={handleCancelCancel}>
            <DialogTitle>Warning</DialogTitle>
            <DialogContent>
              <p>Market Closing is irreversible and trading cannot happen in closed markets, do you still want to close your market?</p>
            </DialogContent>
            <DialogActions>
              <MUIButton onClick={handleCancelCancel} color="primary">
                No
              </MUIButton>
              <MUIButton onClick={() => handleCancelConfirm(MID)} color="primary">
                Yes
              </MUIButton>
            </DialogActions>
          </Dialog>

          {loading && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent', // Semi-transparent white background
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <ScaleLoader color={"#123abc"} loading={loading} size={22} />
            </div>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default UserProfile;