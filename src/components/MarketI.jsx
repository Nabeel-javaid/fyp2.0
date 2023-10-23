import React from "react";

const MarketI = ({
  delay,
  marketID,
  onClose
}) => {
  const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;

  return (
    <div className="market-info-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{name}</h2>
        <h4>{description}</h4>
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
