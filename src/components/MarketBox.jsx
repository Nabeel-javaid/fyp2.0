import React from 'react';
import '../css/main.css';

function MarketBox({ delay, Val, Obj }) {
console.log(typeof Val);
  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="market-box">
        <h4 className="text-title">{Number(Val)}</h4>
        <p>{Obj}</p>
      </div>
    </div>
  );
}

export default MarketBox;