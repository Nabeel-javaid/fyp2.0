import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  CircularProgress,
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

const MarketData = () => {
  const { id } = useParams();
  const marketID = Number(id);
  const [marketData, setMarketData] = useState(null);
  const [marketDetails, setMarketDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <br />
      <br />
      <br />
      <br />
      <br />

      <Container className="market-data-container">
        {/* Main Card */}
        <Card className="main-card" elevation={3}>
          <CardContent>


            <Typography variant="h4" className="market-title">
              {marketDetails.name}
            </Typography>
            <Typography variant="body1" className="market-description">
              {marketDetails.description}
            </Typography>
            <Divider className="divider" />
            <Typography variant="body1">
              Owner Address: {marketDetails.owner}
            </Typography>
            <Typography variant="body1">ID: {marketDetails.id}</Typography>
          </CardContent>
        </Card>

        {/* Grid Container for Market Details */}
        <Grid container spacing={3} className="grid-container">
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">paymentCycleDuration</Typography>
                <Typography variant="body1">{marketDetails.owner}</Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Add more Grid items for other details as needed */}
        </Grid>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Button 
            variant="contained" 
            color="primary" 
            className="action-button"
            onClick={() => {
              window.location.href = `/view-loans/${marketID}`;
            }}
          >
            View Loans
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="action-button"
            onClick={() => {
              window.location.href = `/create-loan/${marketID}`;
            }}
          >
            Create Loan
          </Button>
        </div>
      </Container>
      <ToastContainer />
    </Layout>
  );
};

export default MarketData;
