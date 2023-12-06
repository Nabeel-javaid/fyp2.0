import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {styled} from '@mui/system';

import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
  Badge,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  makeStyles,
} from '@mui/material';

import Layout from '../components/Layout';
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ABIs/MarketData.css'; // Custom CSS for styling

// Supabase client initialization
const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;
const supabase = createClient(supabaseUrl, supabaseKey);

const StyledCard = styled(Card)({
  marginBottom: '20px',
  padding: '20px',
});

const StyledDivider = styled(Divider)({
  marginBottom: '20px',
});

const useStyles = () => ({
  actionButtons: {
    marginBottom: '20px',
    '& > *': {
      marginRight: '10px',
    },
  },
  participantsPaper: {
    padding: '20px',
  },
});

const MarketData = () => {
  const { id } = useParams();
  const marketID = Number(id);
  const [marketData, setMarketData] = useState(null);
  const [marketDetails, setMarketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const abi = require('../ABIs/marketRegistery.json');
        const web3 = new Web3(window.ethereum);
        const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
        const marketContract = new web3.eth.Contract(abi, contractAddress);

        // Fetch market data
        const marketInfo = await marketContract.methods.getMarketData(marketID).call();
        setMarketData(marketInfo);

        // Fetch market details from Supabase
        await loadMarketDetails(marketID);
      } catch (error) {
        console.error('Error loading blockchain data:', error);
        toast.error('Error loading blockchain data. Please try again.'); // Display error toast
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, [marketID]);

  const loadMarketDetails = async (marketID) => {
    try {
      const { data: Market, error } = await supabase
        .from('Markets')
        .select('*')
        .eq('id', marketID);

      if (error) {
        console.error('Error loading data from Supabase:', error);
        toast.error('Error loading data from Supabase. Please try again.'); // Display error toast
      } else if (Market && Market.length > 0) {
        setMarketDetails(Market[0]);
      } else {
        console.warn('No market details found for ID:', marketID);
        toast.warn('No market details found.'); // Display warning toast
      }
    } catch (error) {
      console.error('Unexpected error while loading market details:', error);
      toast.error('Unexpected error. Please try again.'); // Display error toast
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '80vh' }}
          >
            <CircularProgress color="primary" />
          </Grid>
        </Container>
      </Layout>
    );
  }

  if (!marketDetails || !marketData) {
    return (
      <Layout>
        <Container>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '80vh' }}
          >
            <Typography variant="h4">No Data Found</Typography>
          </Grid>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <StyledCard>
          <CardContent>
            <Typography variant="h4">
              {marketDetails.name}
              <Badge color="success" sx={{ marginLeft: '10px' }}>
                New
              </Badge>
            </Typography>
            <Typography variant="body1" sx={{ marginTop: '10px', marginBottom: '20px' }}>
              {marketDetails.description}
            </Typography>
            <StyledDivider />
            <Typography variant="body1" sx={{ marginTop: '10px' }}>
              Owner Address: {marketDetails.owner}
            </Typography>
            <Typography variant="body1">ID: {marketDetails.id}</Typography>
          </CardContent>
        </StyledCard>

        <StyledDivider />

        <Grid container spacing={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">Payment Cycle Duration</Typography>
              <Typography variant="body1">{marketDetails.owner}</Typography>
            </CardContent>
          </StyledCard>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">Active Loans</Typography>
              <Typography variant="body1">20</Typography>
            </CardContent>
          </StyledCard>
          <StyledCard>
            <CardContent>
              <Typography variant="h6">Total Value Locked</Typography>
              <Typography variant="body1">$1,000,000</Typography>
            </CardContent>
          </StyledCard>
          {/* Add more StyledCard components for other details as needed */}
        </Grid>

        <StyledDivider />

        <Box className={classes.actionButtons}>
          <Typography variant="h5" sx={{ marginBottom: '20px' }}>
            Loan Management
          </Typography>
          <Grid container spacing={3}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  window.location.href = `/view-loans/${marketID}`;
                }}
              >
                View Loans
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  window.location.href = `/create-loan/${marketID}`;
                }}
              >
                Create Loan
              </Button>
            </Grid>
            {/* Add more buttons for other actions */}
          </Grid>
        </Box>

        <StyledDivider />

        <Box>
          <Typography variant="h5" sx={{ marginBottom: '20px' }}>
            Market Participants
          </Typography>
          <Paper className={classes.participantsPaper} elevation={3}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>U</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="John Doe"
                  secondary="john.doe@example.com"
                />
                <IconButton>
                  {/* Add an icon or action button */}
                </IconButton>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>W</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Jane Smith"
                  secondary="jane.smith@example.com"
                />
                <IconButton>
                  {/* Add an icon or action button */}
                </IconButton>
              </ListItem>
              {/* Add more ListItems for other participants */}
            </List>
          </Paper>
        </Box>
      </Container>
      <ToastContainer />
    </Layout>
  );
};

export default MarketData;
