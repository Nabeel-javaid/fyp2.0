import React from 'react';
import '../css/main.css';

<<<<<<< HEAD
function MarketBox({ delay, Value, Key }) {

  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="market-box">
        {/* <div className="tumb">
          <img src={imgSrc} alt={altText} />
        </div> */}
        <h4 className="text-title">{Value}</h4>
        <p>{Key}</p>
=======
function MarketBox({ delay, Val, Obj }) {
// console.log(typeof Val);
  return (
    <div className="col-lg-4 col-md-6 col-12 wow fadeInUp" data-wow-delay={delay}>
      <div className="market-box">
        <h4 className="text-title">{Number(Val)}</h4>
        <p>{Obj}</p>
>>>>>>> MuhammadAhmed
      </div>
    </div>
  );
}

export default MarketBox;