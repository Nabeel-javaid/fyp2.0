import React from 'react';
import '../css/main.css';
import '../css/main.css';


function CallAction() {
    return (
        <section className="call-action">
            <div className="container">
                <div className="inner-content">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-7 col-12">
                            <div className="text">
                                <h2>You are using free
                                    <br /> <span>Lite version of LendNest.</span>
                                </h2>
                                <p style={{ display: 'block', marginTop: '10px' }}>Please, purchase full version of the template to
                                    get all pages,
                                    features and commercial license. </p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-5 col-12">
                            <div className="button">
                                <a href="/" className="btn">Buy Pro Version
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CallAction;
