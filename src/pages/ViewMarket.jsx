import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FeatureBox from '../components/FeatureBox';
import MarketInfo from '../components/MarketInfo';
import Layout from "../components/Layout";
import { Button } from '@mui/material';

const useStyles = {
  button: {
    borderRadius: '20px',
    textTransform: 'none',
    boxShadow: 'none',
    backgroundColor: '#1976D2',  // Add background color for initial state
    transition: 'background-color 0.3s',  // Add transition for hover effect
    
  },
  span: {
    fontSize: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
};

const CustomButton = ({ variant, disabled, onClick, children }) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
    onClick();
  };

  return (
    <Button
      variant={variant}
      disabled={disabled}
      onClick={scrollToTop}
      style={useStyles.button}
      className="transition-colors duration-300 hover:bg-blue-500 px-4 py-2 text-white rounded-md"
    >
      {children}
    </Button>
  );
};

// ... rest of the code remains the same

const ViewMarket = () => {
  const [marketCount, setMarketCount] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const marketsPerPage = 9;

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const abi = require('../ABIs/marketRegistery.json');
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';
        const marketContract = new web3.eth.Contract(abi, contractAddress);
        const count = await marketContract.methods.marketCount().call();
        setMarketCount(count);
        const data = [];
        for (let i = 5; i <= count; i++) {
          const marketInfo = await getMarketData(marketContract, i);
          data.push(marketInfo);
        }
        setMarketData(data);
      } catch (error) {
        console.error('Error calling marketCount:', error);
        setError('Error loading data from blockchain. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, []);

  const getMarketData = async (contract, index) => {
    try {
      const marketInfo = await contract.methods.getMarketData(index).call();
      console.log(`Market Data for Market ${index}:`, marketInfo);
      return marketInfo;
    } catch (error) {
      console.error(`Error getting data for Market ${index}:`, error);
      setError(`Error getting data for Market ${index}. Please try again later.`);
      return null;
    }
  };

  const handleFeatureBoxClick = (marketID) => {
    closeMarketBox();
    const selectedMarketInfo = marketData[marketID - 1];
    setSelectedMarket(selectedMarketInfo);
  };

  const closeMarketBox = () => {
    setSelectedMarket(null);
  };

  const startIndex = (currentPage - 1) * marketsPerPage;
  const endIndex = startIndex + marketsPerPage;
  const marketsToDisplay = marketData.slice(startIndex, endIndex);

  return (
    <Layout>
      <div style={{ paddingTop: '5%' }}>
        {selectedMarket === null ? (
          <p>   </p>
        ) : (
          <div className="black-overlay">
            <div className="market-box">
              <MarketInfo
                delay={'.2s'}
                name={"Name"}
                description={"Description"}
                ownerAddress={selectedMarket.owner}
                LET={selectedMarket.loanExpirationTime}
                MFE={selectedMarket.marketplaceFeePercent}
                PCD={selectedMarket.paymentCycleDuration}
                PDD={selectedMarket.paymentDefaultDuration}
              />
              <div className="col-lg-6 col-md-7 col-12">
                <div className="button">
                  <button onClick={closeMarketBox} className="btn">
                    Close Market
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="feature section">
          <div className="container">
            <div className="row">
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {marketCount !== null && !loading && !error && (
                marketsToDisplay.length > 0 ? (
                  marketsToDisplay.map((data, index) => (
                    <FeatureBox
                      key={index}
                      delay={'.2s'}
                      title={"Market Name"}
                      description={"Market Description"}
                      ownerAddress={data.owner}
                      marketID={startIndex + index + 1} // Adjust index
                      onClick={handleFeatureBoxClick}
                    />
                  ))
                ) : (
                  <p>No market data available</p>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6 mb-4">
          <CustomButton
            variant="contained"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous Page
          </CustomButton>
          <span style={useStyles.span}>{currentPage}</span>
          <CustomButton
            variant="contained"
            disabled={endIndex >= marketData.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next Page
          </CustomButton>
        </div>

      </div>
    </Layout>
  );
}

export default ViewMarket;
