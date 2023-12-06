import React from 'react';
// import UserProfile from '../pages/UserProfile';
import '../css/main.css';
import '../css/animate.css';


function HeroArea() {
    return (
        <section className="hero-area">
            <img className="hero-shape" src="../../assets/hero/hero-shape.svg" alt="#" />
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-5 col-md-12 col-12">
                        <div className="hero-content">
                            <h4 className="wow fadeInUp" data-wow-delay=".2s">Start Envesting & Earn Money</h4>
                            <h1 className="wow fadeInUp" data-wow-delay=".4s">Say goodbye
                                to <br />idle &nbsp;
                                <span>
                                    <img className="text-shape" src="../../assets/hero/text-shape.svg" alt="#" />
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
                            <img className="main-image" src="https://i.ibb.co/3Njd8xr/home2-bg.png" alt="home2-bg" border="0"/>
                            <img className="h2-move-1" src="https://i.ibb.co/C0HYYfK/h2-bit-l.png" alt="h2-bit-l" border="0" />
                            <img className="h2-move-2" src="https://i.ibb.co/3pchznN/h2-bit-m.png" alt="h2-bit-m" border="0" />
                            <img className="h2-move-3" src="https://i.ibb.co/mFwSzvw/h2-bit-s.png" alt="h2-bit-s" border="0" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}

export default HeroArea;
