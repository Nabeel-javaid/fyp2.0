import React from 'react';
import '../css/main.css';

function Feature({ delay, title, description, imgSrc, altText }) {
  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="feature-box">
        <div className="thumb">
          <img src={imgSrc} alt={altText || 'Feature Image'} />
        </div>
        <h4 className="text-title">{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default React.memo(Feature);