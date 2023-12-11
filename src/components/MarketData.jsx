import React, { useEffect, useState } from "react";
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';
import '../css/main.css';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;
const supabase = createClient(supabaseUrl, supabaseKey);

const MarketData = ({
  delay,
  marketID,
  onClose
}) => {
  const etherscanUrl = `https://goerli.etherscan.io/address/`;
  const [marketData, setMarketData] = useState(null);
  const [marketDetails, setMarketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Load the ABI
        const abi = require('../ABIs/marketRegistery.json');

        // Connect to the Ethereum network
        const web3 = new Web3(window.ethereum);

        // Load the contract
        const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
        const marketContract = new web3.eth.Contract(abi, contractAddress);

        await getMarketData(marketContract, marketID);

      } catch (error) {
        console.error('Error calling marketCount:', error);
        setError('Error loading blockchain data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadBlockchainData();
  }, [marketID]);

  const getMarketData = async (contract, index) => {
    try {
      const marketInfo = await contract.methods.getMarketData(index).call();
      setMarketData(marketInfo);
      console.log("Market Data:", marketInfo);

      loadMarketDetails(index);
    } catch (error) {
      console.error(`Error getting data for Market ${index}:`, error);
      setError(`Error getting data for Market ${index}. Please try again later.`);
    }
  };

  const loadMarketDetails = async (marketID) => {
    try {
      const { data: Market, error } = await supabase
        .from('Markets')
        .select('*')
        .eq('id', marketID);

      if (error) {
        console.log('Error loading data from Supabase. Please try again later.');
        setError('Error loading data from Supabase. Please try again later.');
      } else {
        setMarketDetails(Market);
        console.log("Details:", Market);
      }
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      setError('Error loading data from Supabase. Please try again later.');
    }
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  if (marketDetails === null || marketData === null) {
    return (
      <div>
        <p>Loading...</p>
      </div>
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
      </div>
    </div>
  );
};

export default React.memo(MarketData);
