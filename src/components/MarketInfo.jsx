import React from "react";
import MarketBox from "./MarketBox";

const MarketInfo = ({
    delay,
  name,
  description,
  ownerAddress,
  LET,
  MFE,
  PCD,
  PDD
}) => {
  const etherscanUrl = `https://goerli.etherscan.io/address/${ownerAddress}`;
// //   console log parameters
//     console.log("delay", delay);
//     console.log("name", name);
//     console.log("description", description);
//     console.log("ownerAddress", ownerAddress);
//     console.log("LET", LET);
//     console.log("MFE", MFE);
//     console.log("PCD", PCD);
//     console.log("PDD", PDD);

  return (
    <div className="feature section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title">
              <h2 className="wow fadeInUp" data-wow-delay=".4s">
                {name}
              </h2>
              <h4 className="wow zoomIn" data-wow-delay=".2s">
                {description}
              </h4>
              {/* <h3 className="wow zoomIn" data-wow-delay=".2s" href={etherscanUrl} >Owner Address</h3> */}
              <h3 className="wow zoomIn" data-wow-delay=".2s">
                              <a href={etherscanUrl} target="_blank" rel="noopener noreferrer">Owner Address</a>
                            </h3>
            </div>
          </div>
        </div>
        <div className="row">
          <MarketBox delay={delay} Val={LET} Obj={"Loan Expiration Time"} />
          <MarketBox delay={delay} Val={MFE} Obj={"Market Fee Percent"} />
          <MarketBox delay={delay} Val={PCD} Obj={"Payment Cycle Duration"} />
          <MarketBox delay={delay} Val={PDD} Obj={"Payment Default Duration"} />
        </div>

        {/* add button of create loan and view loans */}
        <div className="row">
          <hr />
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-7 col-12">
              <div className="button">
                <a href="/" className="btn">
                  Create Loan
                </a>
              </div>
            </div>
            <div className="col-lg-6 col-md-5 col-12">
              <div className="button">
                <a href="/" className="btn">
                  View Loans
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInfo;
