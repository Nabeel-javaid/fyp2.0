import React from 'react';
import '../css/main.css';

function FeatureBox({ delay, title, imgSrc, altText, description, ownerAddress }) {
  const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;

  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-box">
        <div className="tumb">
          <img src={imgSrc} alt={altText} />
        </div>
        <h4 className="text-title">{title}</h4>
        <p>{description}</p>
        <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
          Market Owner Transactions
        </a>
      </div>
    </div>
  );
}

export default FeatureBox;
