import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/main.css';
import '../css/animate.css';
import '../css/bootstrap.min.css';
import '../css/LineIcons.3.0.css';

import {
    ThirdwebProvider,
    ConnectWallet,
    metamaskWallet,
    coinbaseWallet,
    walletConnect,
    safeWallet,
    trustWallet,
    zerionWallet,
    rainbowWallet,
    phantomWallet,
} from "@thirdweb-dev/react";

function NavBar() {
    const [walletConnected, setWalletConnected] = useState(false);

    const handleConnectWallet = () => {
        setWalletConnected(true);
    }

    return (
        <header className="header navbar-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-12">
                        <div className="nav-inner">
                            <nav className="navbar navbar-expand-lg">
                                <Link className="navbar-brand" to="/">
                                    {/* <img src="http://localhost:3000/assets/logo/logo.svg" alt="Logo" className='Logo' /> */}
                                </Link>
                                <button className="navbar-toggler mobile-menu-btn" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                    <span className="toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                                    <ul id="nav" className="navbar-nav ms-auto">
                                        <li className="nav-item">
                                            <Link to="/" className="active" aria-label="Toggle navigation">Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/about-us" aria-label="Toggle navigation">About us</Link>
                                        </li>
                                        <li className="nav-item">
                                            <a className="dd-menu collapsed" href="/" data-bs-toggle="collapse"
                                                data-bs-target="#submenu-1-1" aria-controls="navbarSupportedContent"
                                                aria-expanded="false" aria-label="Toggle navigation">Market</a>
                                            <ul className="sub-menu collapse" id="submenu-1-1">
                                                <li className="nav-item"><Link to="/view-market">View All Markets</Link></li>
                                                <li className="nav-item"><Link to="/create-market">Create Market</Link></li>
                                            </ul>
                                        </li>
                                        <li className="nav-item">
                                            <a className="dd-menu collapsed" href="/" data-bs-toggle="collapse"
                                                data-bs-target="#submenu-1-2" aria-controls="navbarSupportedContent"
                                                aria-expanded="false" aria-label="Toggle navigation">Blog</a>
                                            <ul className="sub-menu collapse" id="submenu-1-2">
                                                <li className="nav-item"><Link to="/blog-grid">Blog Grid</Link></li>
                                                <li className="nav-item"><Link to="/blog-single">Blog Single</Link></li>
                                            </ul>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/profile">Profile</Link>
                                        </li>
                                    </ul>
                                </div> {/* navbar collapse */}
                                <div className="button">
                                    {walletConnected ? (
                                        <p>Wallet Connected</p>
                                    ) : (
                                        <ThirdwebProvider
                                            supportedWallets={[
                                                metamaskWallet({ recommended: true }),
                                                coinbaseWallet(),
                                                walletConnect(),
                                                safeWallet({
                                                    personalWallets: [
                                                        metamaskWallet(),
                                                        coinbaseWallet(),
                                                        walletConnect(),
                                                    ],
                                                }),
                                                trustWallet(),
                                                zerionWallet(),
                                                rainbowWallet(),
                                                phantomWallet(),
                                            ]}
                                        >
                                            <ConnectWallet
                                                theme={"dark"}
                                                btnTitle={"Connect wallet"}
                                                modalSize={"wide"}
                                                welcomeScreen={{}}
                                                onSuccess={handleConnectWallet}
                                            />
                                        </ThirdwebProvider>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default React.memo(NavBar);