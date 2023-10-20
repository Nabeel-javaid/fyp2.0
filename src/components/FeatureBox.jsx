import React from 'react';
import '../css/main.css';

function FeatureBox({ delay, title, description, ownerAddress, marketID }) {
  const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;

  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-box">
        <div className="tumb">
        </div>
        <h4 className="text-title">{title}</h4>
        <p>{description}</p>
        <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
          Market Owner Transactions
          console.log(ownerAddress);
        </a>
      </div>
    </div>
  );
}

export default FeatureBox;