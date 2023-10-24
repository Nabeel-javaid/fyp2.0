import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';
import '../css/main.css';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;
const supabase = createClient(supabaseUrl, supabaseKey);

const MarketI = ({
  delay,
  marketID,
  onClose
}) => {
  const etherscanUrl = `https://goerli.etherscan.io/address/`;
  const [marketData, setMarketData] = useState(null);
  const [marketDetails, setMarketDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Load the ABI
        const abi = require('../ABIs/marketRegistery.json');

        // Connect to the Ethereum network
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user permission to connect

        // Load the contract
        const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
        const marketContract = new web3.eth.Contract(abi, contractAddress);

        await getMarketData(marketContract, marketID);

      } catch (error) {
        console.error('Error calling marketCount:', error);
      } 
      finally {
        setLoading(false);
      }
    }

    loadBlockchainData();
  },[marketData]);

  const getMarketData = async (contract, index) => {
    try {
      const marketInfo = await contract.methods.getMarketData(index).call();
      setMarketData(marketInfo);

      loadMarketDetails(index);

      // return marketInfo;
    } catch (error) {
      console.error(`Error getting data for Market ${index}:`, error);
      // return null;
    }
  };

  const loadMarketDetails = async(marketID) => {

    const { data: Market, error } = await supabase
    .from('Markets')
    .select('*')
    .eq('id', marketID);

    if (error) {
        console.log('Error loading data from blockchain. Please try again later.');
    }
    else {
        setMarketDetails(Market);
        console.log("Details:", marketDetails);
    }
  }

  if (marketDetails === null || marketData === null) {
    // Render an iframe or any other content you want when data is not available
    return (
      <iframe title="NoMarketData" src="https://lottie.host/?file=650d2381-d113-4865-80a7-5f8f3217c5b7/dUlOdERsRD.json" />
    );
  }

  return (
    <div className="market-info-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {loading && <iframe title='Loading' src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json"></iframe>}
        <h2>Name</h2>
        <h4>Description</h4>
        <h3>
          <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
            Owner Address
          </a>
        </h3>

        {/* MarketBox components go here */}
      </div>
    </div>
  );
};

export default MarketI;
