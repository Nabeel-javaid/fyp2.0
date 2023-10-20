import React from 'react';
import '../css/main.css';
import '../css/animate.css';


function HeroArea() {
    return (
        <section className="hero-area">
            <img className="hero-shape" src="http://localhost:3000/assets/hero/hero-shape.svg" alt="#" />
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 col-md-12 col-12">
                        <div className="hero-content">
                            <h4 className="wow fadeInUp" data-wow-delay=".2s">Start Envesting & Earn Money</h4>
                            <h1 className="wow fadeInUp" data-wow-delay=".4s">Say goodbye
                                to <br />idle
                                <span>
                                    <img className="text-shape" src="http://localhost:3000/assets/hero/text-shape.svg" alt="#" />
                                    money.
                                </span>
                            </h1>
                            <p className="wow fadeInUp" data-wow-delay=".6s">Invest your spare change in Bitcoin and save
                                with<br /> Lend to earn passive income.
                            </p>
                            <div className="button wow fadeInUp" data-wow-delay=".8s">
                                <a href="about-us.html" className="btn ">Discover More</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-12">
                        <div className="hero-image">
                            <img className="main-image" src="http://localhost:3000/assets/hero/home2-bg.png" alt="#" />
                            <img className="h2-move-1" src="http://localhost:3000/assets/hero/h2-bit-l.png" alt="#" />
                            <img className="h2-move-2" src="http://localhost:3000/assets/hero/h2-bit-m.png" alt="#" />
                            <img className="h2-move-3" src="http://localhost:3000/assets/hero/h2-bit-s.png" alt="#" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroArea;
