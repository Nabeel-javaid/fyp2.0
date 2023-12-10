import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Typography, Paper, Box } from '@mui/material';
import ScaleLoader from 'react-spinners/ScaleLoader';
import Layout from '../components/Layout';
import CreateLoanBid from '../ABIs/store/CreateLoanBid';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3';

import YOUR_CONTRACT_ABI from '../ABIs/tellerv2.json';
import { useParams } from 'react-router';

const YOUR_CONTRACT_ADDRESS = '0x18a6bcad5e52cbecc34b987697fc7be15edf9599';

const CollateralType = {
  ERC20: 0,
  ERC721: 1,
  ERC1155: 2,
};

function LoanBid() {
  const MID = useParams();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const [lendingToken, setLendingToken] = useState('');
  const [principal, setPrincipal] = useState('');
  const [duration, setDuration] = useState('');
  const [APR, setAPR] = useState('');
  const [metadataURI, setMetadataURI] = useState('');
  const [receiver, setReceiver] = useState('');
  const [collateralType, setCollateralType] = useState(CollateralType.ERC20);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [collateralAddress, setCollateralAddress] = useState('');
  const minAPR = 0;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const loadBlockchainData = async () => {
    try {
      const abi = require('../ABIs/marketRegistery.json');
      const web3 = new Web3(window.ethereum);
      const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
      const marketContract = new web3.eth.Contract(abi, contractAddress);

      // Fetch market data
      const marketInfo = await marketContract.methods.getMarketData(Number(MID.market)).call();
      console.log('MArketAPR: ', marketInfo);
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  useEffect(() => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(web3Provider);

    const contractInstance = new ethers.Contract(
      YOUR_CONTRACT_ADDRESS,
      YOUR_CONTRACT_ABI,
      web3Provider.getSigner()
    );
    setContract(contractInstance);
    loadBlockchainData();
  }, []);

  const validate = () => {
    let tempErrors = {};
    tempErrors.lendingToken = lendingToken ? (isValidAddress(lendingToken) ? '' : 'Must start with "0x".') : 'This field is required.';
    tempErrors.principal = principal ? (isNumeric(principal) ? '' : 'Must be a number.') : 'This field is required.';
    tempErrors.duration = duration ? (isNumeric(duration) ? '' : 'Must be a number.') : 'This field is required.';
    tempErrors.APR = APR ? (isNumeric(APR) ? '' : 'Must be a number.') : 'This field is required.';
    // tempErrors.metadataURI = metadataURI ? '' : 'This field is required.';
    tempErrors.receiver = receiver ? (isValidAddress(receiver) ? '' : 'Must start with "0x".') : 'This field is required.';
    tempErrors.collateralAmount = collateralAmount ? (isNumeric(collateralAmount) ? '' : 'Must be a number.') : 'This field is required.';
    tempErrors.collateralAddress = collateralAddress ? (isValidAddress(collateralAddress) ? '' : 'Must start with "0x".') : 'This field is required.';
  
    if (collateralType !== CollateralType.ERC20) {
      tempErrors.tokenId = tokenId ? '' : 'This field is required.';
    }
  
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };
  
  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };
  
  const isValidAddress = (address) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
  };

  const handleBidSubmission = async () => {
    if (!provider || !contract) return;

    try {
      const collateralInfo = {
        _collateralType: collateralType,
        _amount: collateralAmount,
        _tokenId: collateralType === CollateralType.ERC20 ? '0' : tokenId,
        _collateralAddress: collateralAddress,
      };

      console.log(JSON.stringify(collateralInfo)); // Check the console for collateralInfo

      // Send ETH to the smart contract
      if (collateralType === CollateralType.ERC20) {
        const ethAmount = ethers.utils.parseEther(collateralAmount);
        const txEth = await provider.getSigner().sendTransaction({
          to: '0x53c1f38ad0e8c6c3589abb6707ddd50d98022021',
          value: ethAmount,
        });

        await txEth.wait();
        console.log('ETH sent successfully to the escrow');
    
        await CreateLoanBid(
          lendingToken,
          MID.market,
          principal,
          duration,
          APR,
          metadataURI,
          receiver,
          'ERC20',
          collateralAmount,
          collateralAddress,
          'Pending'
        );

        toast.success("Bid Created Successfully");
      }
    } catch (error) {
      console.error('Error: ', error);
      toast.error("Error Creating Bid");
    } finally {
      setLoading(false); // Set loading to false after the transaction attempt (success or failure)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Set loading to true when submitting
      await handleBidSubmission();
    }
  };

  return (

    <Layout>
      <Box display="flex" justifyContent="space-between"></Box>
      <Paper elevation={3} style={{ padding: '20px', paddingTop: '100px', maxWidth: '800px', margin: '20px auto', textAlign: 'center', marginLeft: '90px' }}>
        <Typography variant="h5" gutterBottom style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '1.5rem' }}>
          Loan Bid Submission
        </Typography>
        {/* <ContactArea/> */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Lending Token Address"
                value={lendingToken}
                onChange={(e) => setLendingToken(e.target.value)}
                error={Boolean(errors.lendingToken)}
                helperText={errors.lendingToken}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Marketplace ID"
                value={MID.market}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Principal"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                error={Boolean(errors.principal)}
                helperText={errors.principal}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={Boolean(errors.duration)}
                helperText={errors.duration}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="APR"
                value={APR}
                onChange={(e) => setAPR(e.target.value)}
                error={Boolean(errors.APR)}
                helperText={errors.APR}
              />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Metadata URI"
                value={metadataURI}
                onChange={(e) => setMetadataURI(e.target.value)}
                error={Boolean(errors.metadataURI)}
                helperText={errors.metadataURI}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Receiver Address"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                error={Boolean(errors.receiver)}
                helperText={errors.receiver}
              />
            </Grid>


            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel
                  style={{ fontWeight: 'normal', marginLeft: '-2px', }}
                >
                  Collateral Type
                </InputLabel>
                <Select
                  value={collateralType}
                  onChange={(e) => setCollateralType(e.target.value)}
                  label="Collateral Type"
                >
                  <MenuItem value={CollateralType.ERC20}>ERC20</MenuItem>
                  <MenuItem value={CollateralType.ERC721}>ERC721</MenuItem>
                  <MenuItem value={CollateralType.ERC1155}>ERC1155</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Collateral Amount"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                error={Boolean(errors.collateralAmount)}
                helperText={errors.collateralAmount}
              />
            </Grid>
            {collateralType !== CollateralType.ERC20 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Token ID"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  error={Boolean(errors.tokenId)}
                  helperText={errors.tokenId}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Collateral Address"
                value={collateralAddress}
                onChange={(e) => setCollateralAddress(e.target.value)}
                error={Boolean(errors.collateralAddress)}
                helperText={errors.collateralAddress}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
                Submit Bid
              </Button>
            </Grid>
          </Grid>
        </form>

        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ScaleLoader color={"#123abc"} loading={loading} size={22} />
          </div>
        )}
      </Paper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </Layout>
  );
}

export default LoanBid;