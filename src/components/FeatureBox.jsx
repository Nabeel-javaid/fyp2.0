import React from 'react';
import '../css/main.css';

function FeatureBox({ delay }) {
  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-box">
        <div className="tumb">
          <img src="http://localhost:3000/assets/features/feature-icon-1.png" alt="" />
        </div>
        <h4 className="text-title">Instant Exchage</h4>
        <p>Invest in Bitcoin on the regular or save with one of the highest interest rates on the market.</p>
      </div>
    </div>
  );
}

export default FeatureBox;
