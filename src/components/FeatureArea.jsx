import React from 'react';
import FeatureBox from './FeatureBox';
import '../css/main.css';
import '../css/animate.css';

function FeatureArea() {

    const featureData = [
        {
          delay: '.2s',
          imgSrc: 'http://localhost:3000/assets/features/feature-icon-1.png',
          altText: 'Instant Exchange',
          title: 'LoanOwn',
          description: 'Loan anything at any time, from anywhere.',
          ownerAddress: '0x5a2893F75b1b94e8553e14c7988C09a7319b4E36',
        },
        {
            delay: '.2s',
            imgSrc: 'http://localhost:3000/assets/features/feature-icon-1.png',
            altText: 'Instant Exchange',
            title: 'LoanOwn',
            description: 'Loan anything at any time, from anywhere.',
            ownerAddress: '0x5a2893F75b1b94e8553e14c7988C09a7319b4E36',
        },
        {
            delay: '.2s',
            imgSrc: 'http://localhost:3000/assets/features/feature-icon-1.png',
            altText: 'Instant Exchange',
            title: 'LoanOwn',
            description: 'Loan anything at any time, from anywhere.',
            ownerAddress: '0x5a2893F75b1b94e8553e14c7988C09a7319b4E36',
        },
        {
            delay: '.2s',
            imgSrc: 'http://localhost:3000/assets/features/feature-icon-1.png',
            altText: 'Instant Exchange',
            title: 'LoanOwn',
            description: 'Loan anything at any time, from anywhere.',
            ownerAddress: '0x5a2893F75b1b94e8553e14c7988C09a7319b4E36',
        },
        {
            delay: '.2s',
            imgSrc: 'http://localhost:3000/assets/features/feature-icon-1.png',
            altText: 'Instant Exchange',
            title: 'LoanOwn',
            description: 'Loan anything at any time, from anywhere.',
            ownerAddress: '0x5a2893F75b1b94e8553e14c7988C09a7319b4E36',
        },
    ];

  return (
    <div className="feature section">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="section-title">
                        <h3 className="wow zoomIn" data-wow-delay=".2s">LendNest</h3>
                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Our Markets</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                
                {featureData.map((feature, index) => (
                    <FeatureBox
                    key={index}
                    delay={feature.delay}
                    imgSrc={feature.imgSrc}
                    altText={feature.altText}
                    title={feature.title}
                    description={feature.description}
                    ownerAddress={feature.ownerAddress}
                    />
                ))}

                {/* <FeatureBox delay=".4s" />
                <FeatureBox delay=".6s" /> */}

            </div>
        </div>
    </div>
  );
}

export default FeatureArea;
