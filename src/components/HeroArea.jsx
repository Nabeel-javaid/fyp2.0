import React from 'react';
import '../css/main.css';
import '../css/animate.css';


function HeroArea() {
    return (
        <section className="hero-area">
            <img className="hero-shape" src="/assets/hero/hero-shape.svg" alt="#" />
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 col-md-12 col-12">
                        <div className="hero-content">
                            <h4 className="wow fadeInUp" data-wow-delay=".2s">Start Lending & Borrowing</h4>
                            <h1 className="wow fadeInUp" data-wow-delay=".4s">Web3 apps without
                                <br />
                                <span>
                                    coding.
                                    <img className="text-shape" src="assets/hero/text-shape.svg" alt="#" />
                                </span>
                            </h1>
                            <p className="wow fadeInUp" data-wow-delay=".6s">Lend your spare change in Cryptocurrency to
                                earn.<br /> Lend and borrow in real time.
                            </p>
                            <div className="button wow fadeInUp" data-wow-delay=".8s">
                                <a href="about-us.html" className="btn ">Discover More</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-12">
                        <div className="hero-image">
                            <img className="main-image" src="/assets/hero/home2-bg.png" alt="#" />
                            <img className="h2-move-1" src="/assets/hero/h2-bit-l.png" alt="#" />
                            <img className="h2-move-2" src="/assets/hero/h2-bit-m.png" alt="#" />
                            <img className="h2-move-3" src="/assets/hero/h2-bit-s.png" alt="#" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroArea;
