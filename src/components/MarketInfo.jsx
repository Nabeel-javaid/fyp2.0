import React from 'react'
import MarketBox from './MarketBox';

const MarketInfo = (name, description, ownerAddress, loana, loanb, loanc) => {
  return (

    <div className="feature section">
    <div className="container">
        <div className="row">
            <div className="col-12">
                <div className="section-title">
                    <h2 className="wow fadeInUp" data-wow-delay=".4s">Name</h2>
                    <h4 className="wow zoomIn" data-wow-delay=".2s">Description</h4>
                    <h3 className="wow zoomIn" data-wow-delay=".2s">Owner Address</h3>
                </div>
            </div>
        </div>
        <div className="row">
    <MarketBox
    delay='.4s'
    Value='50M'
    Key='Loan Bids'
    />
    <MarketBox
    delay='.4s'
    Value='50M'
    Key='Loan Bids'
    />
    <MarketBox
    delay='.4s'
    Value='50M'
    Key='Loan Bids'
    />
    
    </div>

    {/* add button of create loan and view loans */}
    <div className="row">
        <hr />
    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-7 col-12">
                            <div className="button">
                                <a href="#" className="btn">Create Loan
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-5 col-12">
                            <div className="button">
                                <a href="#" className="btn">View Loans
                                </a>
                            </div>
                        </div>
                    </div>
    </div>
    </div>
    </div>

  )
}

export default MarketInfo