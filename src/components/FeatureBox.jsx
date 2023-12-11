import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI from '../ABIs/marketRegistery.json';
import '../css/main.css';

function FeatureBox({ delay, title, description, ownerAddress, marketID, onClick }) {
  const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;
  const [isClosed, setisClosed] = useState(false);

  const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';

  const handleBoxClick = () => {
    onClick(marketID);
    getMarketStatus();
  };

  const getMarketStatus = async () => {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const marketContract = new web3.eth.Contract(contractABI, contractAddress);

    const status = await marketContract.methods.isMarketClosed(marketID).call();
    setisClosed(status);
    console.log(status);
  };

  useEffect(() => {
    getMarketStatus();
  }, [marketID]);

  const statusIndicatorStyle = {
    color: isClosed ? 'red' : 'green',
    textAlign: 'right',
    marginTop: '25%',
    display: 'flex-end',
  };

  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-box" onClick={handleBoxClick}>
        <h4 className="text-title">{title}</h4>
        <p>{description}</p>
        <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
          Market Owner
        </a>
        <div className="status-indicator" style={statusIndicatorStyle}>
          {isClosed ? 'Closed' : 'Open'}
        </div>
      </div>
    </div>
  );
}

export default React.memo(FeatureBox);