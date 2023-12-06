import React from 'react';
import Feature from './Feature';
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
                    <Feature
                        delay=".2s"
                        title="Feature 1"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        imgSrc={"https://i.ibb.co/BTYVc2n/feature-icon-1.png"}
                    />

                    <Feature
                        delay=".2s"
                        title="Feature 2"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        imgSrc={"https://i.ibb.co/BTYVc2n/feature-icon-1.png"}
                    />
                    <Feature
                        delay=".2s"
                        title="Feature 3"
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        imgSrc={"https://i.ibb.co/BTYVc2n/feature-icon-1.png"}
                    />
                </div>
            </div>
        </div>
    );
}

export default FeatureArea;
