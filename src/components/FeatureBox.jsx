// import React from 'react';
// import '../css/main.css';

// function FeatureBox({ delay, title, description, ownerAddress, marketID}) {
//   const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;

//   return (
//     <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
//       <div className="feature-box">
//         <div className="tumb">
//         </div>
//         <h4 className="text-title">{title}</h4>
//         <p>{description}</p>
//         <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
//           Market Owner
//         </a>
//       </div>
//     </div>
//   );
// }

// export default FeatureBox;
import React from 'react';
import '../css/main.css';

function FeatureBox({ delay, title, description, ownerAddress, marketID, onClick }) {
  const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;

  const handleBoxClick = () => {
    // You can perform actions here when the FeatureBox is clicked
    // For example, you can open a modal, navigate to a new page, etc.
    // You can also use onClick to pass data to the parent component, if needed.
    onClick(marketID);
  };

  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-box" onClick={handleBoxClick}>
        <div className="tumb">
          {/* Your box content */}
        </div>
        <h4 className="text-title">{title}</h4>
        <p>{description}</p>
        <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">
          Market Owner
        </a>
      </div>
    </div>
  );
}

export default FeatureBox;