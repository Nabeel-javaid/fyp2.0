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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

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
        console.error('Error loading market details:', error);
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
        <Container >
          <Grid
            container
            justifyContent="center"
            alignItems="left"
            style={{ height: '100vh', backgroundColor:"red" }}
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


  
    <Layout  >




    <Typography variant="h5" fontWeight="bold" textcolor="black" sx={{ marginBottom: '20px' }}>
      Market Details
    </Typography>
   
  

 
  


  <Container style={{ marginTop: '120px' }}  >
    
  <Typography
  variant="h5"
  fontWeight="bold"
  color="black"
  sx={{
    marginBottom: '20px',
    textAlign: 'center', // Align text to the center
    animation: 'fadeIn 1s ease-in-out', // Apply fade-in animation
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
  }}
>
  Market Details
</Typography>
    <TableContainer component={Paper}>
      <Table>
        
        <TableBody>
          {/* Market Details */}
          <TableRow>
            <TableCell>Market Name</TableCell>
            <TableCell>
              {marketDetails.name}{' '}
              
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>{marketDetails.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Owner Address</TableCell>
            <TableCell>{marketDetails.owner}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>{marketDetails.id}</TableCell>
          </TableRow>

          {/* Additional Market Details */}
          <TableRow>
            <TableCell>Additional Details</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Payment Cycle Duration</TableCell>
            <TableCell>{marketDetails.paymentCycle}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Active Loans</TableCell>
            <TableCell>20</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Value Locked</TableCell>
            <TableCell>$1,000,000</TableCell>
          </TableRow>

          {/* Action Buttons */}
         
        </TableBody>
      </Table>
    </TableContainer>
    <ToastContainer />

    
  </Container>

  

  {/* Card for Market Participants */}
  <Card variant="filled">
  <CardContent>
    <Box display="flex" justifyContent="center">
      <div>
        <Typography variant="h5" marginLeft={"20px"} marginTop={"20px"} fontWeight={"bold"}>Market Participants</Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>U</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="John Doe"
              secondary="john.doe@example.com"
            />
            <IconButton>{/* Add an icon or action button */}</IconButton>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>W</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Jane Smith"
              secondary="jane.smith@example.com"
            />
            <IconButton>{/* Add an icon or action button */}</IconButton>
          </ListItem>
          {/* Add more ListItems for other participants */}
        </List>
      </div>
    </Box>
  </CardContent>
</Card>

{/* //box card */}
  <Box display="flex" justifyContent="center" >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.href = `/view-loans/${marketID}`;
          }}
          sx={{ marginRight: '16px', marginBottom: '20px' }} // Add margin between buttons
        >
          View Loans
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            window.location.href = `/create-loan/${marketID}`;
          }}
          sx={{marginBottom: '20px'}}
        >
          Create Loan
        </Button>
        {/* Add more buttons for other actions */}
      </Box>
</Layout>

  );
};

export default MarketData;
