/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Typography, Paper, Box } from '@mui/material';
import ScaleLoader from 'react-spinners/ScaleLoader';
import Layout from '../components/Layout';
import CreateLoanBid from '../ABIs/store/CreateLoanBid';
import { toast, ToastContainer } from 'react-toastify';
import Web3 from 'web3';
import animationData from '../ABIs/store/LottieAnimation.json';
import Lottie from "lottie-react";
import { Alchemy, Network } from "alchemy-sdk";
import ListItemIcon from '@mui/material/ListItemIcon';
import COINS_LIST from '../ABIs/store/uniswap.json';

import YOUR_CONTRACT_ABI from '../ABIs/tellerv2.json';
import { useParams } from 'react-router';

const YOUR_CONTRACT_ADDRESS = '0x18a6bcad5e52cbecc34b987697fc7be15edf9599';

const CollateralType = {
  ERC20: 0,
  ERC721: 1,
  ERC1155: 2,
};


const config = {
  apiKey: "owPQ3CAm4xkJ7gukesUl4w7iqUpNHVIb",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

function CreateLoan() {
  const MID = useParams();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // Moralis user NFTs state
  const [userNFTs, setUserNFTs] = useState([]);
  const [fetchingNFTs, setFetchingNFTs] = useState(false);

  const [lendingToken, setLendingToken] = useState('');
  const [principal, setPrincipal] = useState('');
  const [duration, setDuration] = useState('');
  const [APR, setAPR] = useState('');
  const [receiver, setReceiver] = useState('');
  const [collateralType, setCollateralType] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [collateralAddress, setCollateralAddress] = useState('');
  const [top200Coins, setTop200Coins] = useState([]);
  const [metaData, setMetaData] = useState([]);

  let minAPR = 0;
  let maxCollateral = 0;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const getCoins = async () => {
      try {

        toast.success("Please wait while we fetch the tokens in your wallet!")
        setLoading(true);

        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("Account Address: ", address);

        const balances = await alchemy.core.getTokenBalances(address);

        const nonZeroBalances = balances.tokenBalances.filter((token) => {
          return token.tokenBalance !== "0";
        });

        let i = 1;
        let metadataArray = [];


        for (let token of nonZeroBalances) {
          // Get balance of token

          // Get metadata of token
          const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);



          // Game
          const coinLogo = await COINS_LIST.tokens.filter((taken) => taken.address === token.contractAddress);

          metadataArray.push({
            id: i++,
            name: metadata.name,
            logo: coinLogo[0].logoURI,
            address: token.contractAddress,
          });
        }

        setMetaData(metadataArray);
        setLoading(false);

      } catch (err) {
        console.error(err);
      }

    }

    const initMoralis = async () => {
      try {
        toast.success("Please wait while we fetch your NFTs!")

        setLoading(true);

        const signer = provider.getSigner();

        const accountAddress = await signer.getAddress();

        const nfts = await alchemy.nft.getNftsForOwner(accountAddress);

        setUserNFTs(nfts.ownedNfts);
        setLoading(false);
      } catch (e) {
        console.error(e);
      } finally {
        setFetchingNFTs(false);
      }
    };

    if (collateralType === CollateralType.ERC721 || collateralType === CollateralType.ERC1155) {
      setFetchingNFTs(true);
      initMoralis();
    }
    if (collateralType === CollateralType.ERC20) {
      getCoins();
    }
  }, [collateralType]);



  const loadBlockchainData = async () => {
    try {
      const abi = require('../ABIs/marketRegistery.json');
      const web3 = new Web3(window.ethereum);
      const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
      const marketContract = new web3.eth.Contract(abi, contractAddress);

      // Fetch market data
      const marketInfo = await marketContract.methods.getMarketData(Number(MID.market)).call();
      console.log('Market APR', marketInfo.marketplaceFeePercent);
      minAPR = marketInfo.marketplaceFeePercent;
      console.log('APR', minAPR);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    setTop200Coins(COINS_LIST.tokens.slice(0, 50));
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
    // tempErrors.lendingToken = lendingToken ? (isValidAddress(lendingToken) ? '' : 'Must start with "0x".') : 'This field is required.';
    tempErrors.principal = principal ? (isNumeric(principal) ? '' : 'Must be a number.') : 'This field is required.';
    tempErrors.duration = duration ? (isNumeric(duration) ? '' : 'Must be a number.') : 'This field is required.';
    tempErrors.APR = APR ? (isNumeric(APR) ? (APR >= minAPR ? '' : `APR should be greater than ${minAPR}`) : 'Must be a number.') : 'This field is required.';
    // tempErrors.metadataURI = metadataURI ? '' : 'This field is required.';
    tempErrors.receiver = receiver ? (isValidAddress(receiver) ? '' : 'Must start with "0x".') : 'This field is required.';
    // tempErrors.collateralAmount = collateralAmount ? (isNumeric(collateralAmount) ? '' : 'Must be a number.') : 'This field is required.';
    // tempErrors.collateralAddress = collateralAddress ? (isValidAddress(collateralAddress) ? '' : 'Must start with "0x".') : 'This field is required.';

    // if (collateralType !== CollateralType.ERC20) {
    //   tempErrors.tokenId = tokenId ? '' : 'This field is required.';
    // }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const isNumeric = (value) => {
    return /^-?\d*\.?\d+$/.test(value);
  };


  const isValidAddress = (address) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
  };

  const handleBidSubmission = async () => {
    if (!provider || !contract) return;

    try {


      // Send ETH to the smart contract
      if (collateralType === CollateralType.ERC20) {
        const ethAmount = ethers.utils.parseEther(collateralAmount);
        const txEth = await provider.getSigner().sendTransaction({
          to: '0x53c1f38ad0e8c6c3589abb6707ddd50d98022021',
          value: ethAmount,
        });

        await txEth.wait();
        toast.success('ETH sent successfully to the escrow');

        const signer = provider.getSigner();

        const accountAddress = await signer.getAddress();


        await CreateLoanBid(
          lendingToken,
          MID.market,
          principal,
          duration,
          APR,
          receiver,
          'ERC20',
          collateralAmount,
          collateralAddress,
          'Pending',
          accountAddress
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
    console.log("Submit");
    e.preventDefault();
    if (validate()) {
      setLoading(true); // Set loading to true when submitting
      await handleBidSubmission();
    }
  };

  return (
    <Layout>


      <Box display="flex" justifyContent="space-between" style={{ marginTop: '10%', marginBottom: '6%' }}>
        <Paper elevation={3} style={{ padding: '20px', paddingTop: '35px', paddingBottom: '20px', maxWidth: '700px', margin: '20px auto', textAlign: 'center', marginLeft: '90px', marginTop: '28px' }}>

          <Typography variant="h5" gutterBottom style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '1.4rem', marginTop: '-50px' }}>
            Loan Bid Submission
          </Typography>



          {/* <ContactArea/> */}
          <form onSubmit={handleSubmit} >
            <Grid container spacing={2}>


              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel style={{ fontWeight: 'normal', marginLeft: '-2px' }}>Lending Token</InputLabel>
                  <Select
                    value={lendingToken}
                    onChange={(e) => {
                      const selectedCoin = top200Coins.find((coin) => coin.address === e.target.value);
                      setLendingToken(selectedCoin ? selectedCoin.address : '');

                    }}
                    label="Lending Token Address"
                  >
                    {top200Coins.map((coin) => (
                      <MenuItem key={coin.address} value={coin.address}>
                        <Typography variant="inherit">
                          <img src={coin.logoURI} width="26" height="26" />

                          <span style={{ marginLeft: '8px' }}>{coin.name}</span>
                          <span style={{ marginLeft: '4px', color: '#888' }}> ({coin.symbol})</span>
                        </Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  placeholder={minAPR}
                  onChange={(e) => setAPR(e.target.value)}
                  error={Boolean(errors.APR)}
                  helperText={errors.APR}
                />
              </Grid>
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

              {collateralType === CollateralType.ERC721 && !fetchingNFTs ? (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      style={{ fontWeight: 'normal', marginLeft: '-2px', }}
                    >
                      {userNFTs.length === 0 ? "No NFTS Found" : "Collateral NFT"}
                    </InputLabel>
                    <Select
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      label={userNFTs.length === 0 ? "No NFTS Found" : "Collateral NFT"}
                    >
                      {userNFTs.map((nft, index) => (
                        (nft.contract.isSpam === false || nft.contract.isSpam === undefined) && nft.tokenType === 'ERC721' ? (
                          <MenuItem value={nft.tokenId} key={index}>
                            <ListItemIcon>
                              <img
                                src={
                                  nft.contract.openSeaMetadata.imageUrl === undefined ? nft.image.originalUrl : nft.contract.openSeaMetadata.imageUrl
                                }
                                width="30"
                                height="30" />
                            </ListItemIcon>
                            <Typography variant="inherit">{nft.contract.openSeaMetadata.collectionName + " #" + nft.tokenId}</Typography>
                          </MenuItem>
                        ) : null
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ) : (
                collateralType === CollateralType.ERC1155 && !fetchingNFTs ? (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        style={{ fontWeight: 'normal', marginLeft: '-2px', }}
                      >
                        {userNFTs.length === 0 ? "No NFTS Found" : "Collateral NFT"}
                      </InputLabel>
                      <Select
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        label={userNFTs.length === 0 ? "No NFTS Found" : "Collateral NFT"}
                      >
                        {userNFTs.map((nft, index) => (
                          (nft.contract.isSpam === false || nft.contract.isSpam === undefined) && nft.tokenType === 'ERC1155' ? (
                            <MenuItem value={nft.tokenId} key={index}>
                              <ListItemIcon>
                                <img
                                  src={
                                    nft.contract.openSeaMetadata.imageUrl === undefined ? nft.image.originalUrl : nft.contract.openSeaMetadata.imageUrl
                                  }
                                  width="20"
                                  height="20" />
                              </ListItemIcon>
                              <Typography variant="inherit">
                                {nft.contract.openSeaMetadata.collectionName === undefined ?
                                  nft.collection.name :
                                  nft.contract.openSeaMetadata.collectionName
                                }
                              </Typography>
                            </MenuItem>
                          ) : null
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  <>
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

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel
                          style={{ fontWeight: 'normal', marginLeft: '-2px', }}
                        >
                          {metaData.length === 0 ? "No Coins Found" : "Collateral Address"}
                        </InputLabel>
                        <Select
                          value={collateralAddress}
                          onChange={(e) => setCollateralAddress(e.target.value)}
                          label={metaData.length === 0 ? "No Coins Found" : "Collateral Address"}
                        >
                          {metaData.map((data, index) => (
                            <MenuItem value={data.address} key={index}>
                              <Typography variant="inherit">

                                <img
                                  src={data.logo}
                                  width="20"
                                  height="20" />
                                &nbsp;
                                {data.name}
                              </Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                ))}

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
        <Box display="flex" justifyContent="flex-end" style={{ marginTop: '10%' }}>
          <Lottie
            animationData={animationData}
            style={{ width: '600px', height: '300px' }}
          />
        </Box>
      </Box>

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

export default CreateLoan;