import React from 'react'
import Layout from '../components/Layout'
import HeroArea from '../components/HeroArea'
import FeatureArea from '../components/FeatureArea'
import CallAction from '../components/CallAction'

const HomePage = () => {
  return (
    <Layout>
        <HeroArea />
        <FeatureArea />
        <CallAction />
        <h1>Home Page</h1>
    </Layout>
  )
}

export default HomePage