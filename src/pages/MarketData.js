<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';

import Layout from "../components/Layout";
// import '../css/main.css';
import '../css/MarketData.css';

=======
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
>>>>>>> nabeel
const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;
const supabase = createClient(supabaseUrl, supabaseKey);

const MarketData = () => {
<<<<<<< HEAD
  const ID = useParams();
  const marketID = Number(ID.id);

=======
  const { id } = useParams();
  const marketID = Number(id);
>>>>>>> nabeel
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

<<<<<<< HEAD
        const marketInfo = await marketContract.methods.getMarketData(marketID).call();
        setMarketData(marketInfo);

        loadMarketDetails(marketID);
      } catch (error) {
        console.error('Error calling marketCount:', error);
      } finally {
        setLoading(false);
      }
    }
=======
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
>>>>>>> nabeel

    loadBlockchainData();
  }, [marketID]);

  const loadMarketDetails = async (marketID) => {
<<<<<<< HEAD
    const { data: Market, error } = await supabase
      .from('Markets')
      .select('*')
      .eq('id', marketID);

      setMarketDetails(Market[0]);

    if (error) {
      console.log('Error loading data from Supabase. Please try again later.');
    }
  }

  // Conditional rendering
  if (loading) {
    return (
      <Layout>
        <div className="market-data-container">
          <iframe title="Loading" src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json" />
        </div>
=======
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
>>>>>>> nabeel
      </Layout>
    );
  }

<<<<<<< HEAD
  if (marketDetails === null || marketData === null) {
    return (
      <Layout>
        <div className="market-data-container">
          <iframe title="NoMarketData" src="https://lottie.host/?file=650d2381-d113-4865-80a7-5f8f3217c5b7/dUlOdERsRD.json" />
        </div>
=======
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
>>>>>>> nabeel
      </Layout>
    );
  }

<<<<<<< HEAD
  const etherscanUrl = `https://goerli.etherscan.io/address/${marketData.owner}`;

  return (
    <Layout>
      {/* <h2>NAME</h2>
      <h2>NAME</h2>
            <h2>NAME</h2>
            <h2>NAME</h2>
            <h2>NAME</h2>
            <h2>NAME</h2>
            <h2>NAME</h2>
            <h2>NAME</h2>

      <div className="market-info-modal" style={{ paddingTop: "2rem" }}>
        <div className="modal-content">
          <h2>{marketDetails.name}</h2>
          <p>{marketDetails.description}</p>
          <h3>
            <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
              Owner Address
            </a>
          </h3>

          
        </div>
      </div> */}
      <hr />
      <div className="market-data-container">
        <div className="market-data-box">
          <h2>{marketDetails.name}</h2>
          <p>{marketDetails.description}</p>
          <p>Owner Address: {marketDetails.owner}</p>
          <p>ID: {marketDetails.id}</p>
          <div className="values">
            <div className="market-box">
              <h4>{marketData.paymentCycleDuration}</h4>
              <p>Payment Cycle Duration</p>
            </div>
            <div className="market-box">
              <h4>{marketData.paymentDefaultDuration}</h4>
              <p>Payment Default Duration</p>
            </div>
            <div className="market-box">
              <h4>{marketData.loanExpirationTime}</h4>
              <p>Loan Expiration Time</p>
            </div>
            <div className="market-box">
              <h4>{marketData.marketplaceFeePercent}</h4>
              <p>Marketplace Fee Percent</p>
            </div>
          </div>
          <div className="buttons">
            <button className="view-button">View Loans</button>
            <button className="create-button">Create Loan</button>
          </div>
        </div>
      </div>
=======
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
>>>>>>> nabeel
    </Layout>
  );
};

<<<<<<< HEAD
export default MarketData;
=======
export default MarketData;
>>>>>>> nabeel
