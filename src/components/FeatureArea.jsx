import React from 'react';
import FeatureBox from './FeatureBox';
import '../css/main.css';
import '../css/animate.css';

function FeatureArea() {
  return (
    <div className="feature section">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="section-title">
                        <h3 className="wow zoomIn" data-wow-delay=".2s">Why choose us</h3>
                        <h2 className="wow fadeInUp" data-wow-delay=".4s">Our features</h2>
                        <p className="wow fadeInUp" data-wow-delay=".6s">There are many variations of passages of Lorem
                            Ipsum available, but the majority have suffered alteration in some form.</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <FeatureBox delay=".2s" />
                <FeatureBox delay=".4s" />
                <FeatureBox delay=".6s" />
            </div>
        </div>
    </div>
  );
}

export default FeatureArea;
