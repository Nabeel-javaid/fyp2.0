import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import FeatureBox from '../components/FeatureBox';
import MarketInfo from '../components/MarketInfo';

const ViewMarket = () => {
  const [marketCount, setMarketCount] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [isMarketBoxVisible, setIsMarketBoxVisible] = useState(false);

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

        // Call the marketCount function
        const count = await marketContract.methods.marketCount().call();
        console.log('Market Count:', count);
        setMarketCount(count);

        // Get market data for each market
        const data = [];
        for (let i = 25; i <= count; i++) {
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

// Handle the click event on a FeatureBox
const handleFeatureBoxClick = (marketID) => {
  const selectedMarketInfo = marketData[marketID - 1];
  setSelectedMarket(selectedMarketInfo);
  setIsMarketBoxVisible(true);
};

// Close the MarketBox
const closeMarketBox = () => {
  setIsMarketBoxVisible(false);
  setSelectedMarket(null);
};

return (
  <div>

  {selectedMarket===null ? (
      <p>No Market Selected</p>
    ): (
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
            marketData.length > 0 ? (
              marketData.map((data, index) => (
                <FeatureBox
                  key={index}
                  delay={'.2s'}
                  title={"Market Name"}
                  description={"Market Description"}
                  ownerAddress={data.owner}
                  marketID={index + 1} // Adjust index
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
  </div>
);

}
export default ViewMarket;