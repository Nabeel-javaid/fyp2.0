import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';

import Layout from "../components/Layout";
// import '../css/main.css';
import '../css/MarketData.css';

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

  // Conditional rendering
  if (loading) {
    return (
      <Layout>
        <div className="market-data-container">
          <iframe title="Loading" src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json" />
        </div>
      </Layout>
    );
  }

  if (marketDetails === null || marketData === null) {
    return (
      <Layout>
        <div className="market-data-container">
          <iframe title="NoMarketData" src="https://lottie.host/?file=650d2381-d113-4865-80a7-5f8f3217c5b7/dUlOdERsRD.json" />
        </div>
      </Layout>
    );
  }

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
    </Layout>
  );
};

export default MarketData;
