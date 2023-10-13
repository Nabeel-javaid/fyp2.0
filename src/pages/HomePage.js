import React from "react";
import Layout from "../components/Layout";
import HeroArea from "../components/HeroArea";
import FeatureArea from "../components/FeatureArea";
import CallAction from "../components/CallAction";

const HomePage = () => (
    <Layout>
        <HeroArea />
        <FeatureArea />
        {/* <CallAction /> */}
    </Layout>
);

export default HomePage;

