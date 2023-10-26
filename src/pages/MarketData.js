import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Button 
} from '@mui/material';
import Layout from '../components/Layout';
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;
const supabase = createClient(supabaseUrl, supabaseKey);

const MarketData = () => {
  const ID = useParams();
  const marketID = Number(ID.id);

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

        const marketInfo = await marketContract.methods.getMarketData(marketID).call();
        setMarketData(marketInfo);

        loadMarketDetails(marketID);
      } catch (error) {
        console.error('Error calling marketCount:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBlockchainData();
  }, [marketID]);

  const loadMarketDetails = async (marketID) => {
    const { data: Market, error } = await supabase
      .from('Markets')
      .select('*')
      .eq('id', marketID);

    setMarketDetails(Market[0]);

    if (error) {
      console.log('Error loading data from Supabase. Please try again later.');
    }
  }

  if (loading) {
    return (
      <Layout>
        <Container>
          <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
            <Typography variant="h4">Loading...</Typography>
          </Grid>
        </Container>
      </Layout>
    );
  }

  if (marketDetails === null || marketData === null) {
    return (
      <Layout>
        <Container>
          <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
            <Typography variant="h4">No Data Found</Typography>
          </Grid>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Card variant="outlined" style={{ margin: '2rem 0' }}>
          <CardContent>
            <Typography variant="h4">{marketDetails.name}</Typography>
            <Typography variant="body1">{marketDetails.description}</Typography>
            <Divider style={{ margin: '1rem 0' }} />
            <Typography variant="body1">Owner Address: {marketDetails.owner}</Typography>
            <Typography variant="body1">ID: {marketDetails.id}</Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Market Name</Typography>
                <Typography variant="body1">{marketDetails.name}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Market Description</Typography>
                <Typography variant="body1">{marketDetails.description}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Market ID</Typography>
                <Typography variant="body1">{marketDetails.id}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Owner Address</Typography>
                <Typography variant="body1">{marketDetails.owner}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Payment Cycle Duration</Typography>
                <Typography variant="body1">{marketData.paymentCycleDuration}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Payment Default Duration</Typography>
                <Typography variant="body1">{marketData.paymentDefaultDuration}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Loan Expiration Time</Typography>
                <Typography variant="body1">{marketData.loanExpirationTime}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Marketplace Fee Percent</Typography>
                <Typography variant="body1">{marketData.marketplaceFeePercent}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }}>View Loans</Button>
            <Button variant="contained" color="secondary">Create Loan</Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default MarketData;
