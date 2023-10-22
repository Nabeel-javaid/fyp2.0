import { React, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FeatureBox from '../components/FeatureBox';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const ViewM = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [marketCount, setMarketCount] = useState(null);
    const [marketData, setMarketData] = useState([]);

    useEffect(() => {
        const loadMarketData = async() => {
            const { data: Markets, error } = await supabase
            .from('Markets')
            .select('*');

            if (error) {
                setError('Error loading data from blockchain. Please try again later.');
            }
            else {
                setMarketCount(Markets.length);
                setMarketData(Markets);
                setLoading(false);
                console.log(marketData);
            }
        }

        loadMarketData();
    }, []);

    const handleFeatureBoxClick = (marketID) => {
        console.log("Open market ", marketID);
    };

  return (
        <Layout>
          <div style={{ paddingTop: '5%' }}>
            <div className="feature section">
              <div className="container">
                <div className="row">
                  {loading && <p>Loading...</p>}
                  {error && <p>{error}</p>}
                  {marketCount !== null && !loading && !error && (
                    marketData.length > 0 ? (
                      marketData.map((data, index) => (
                        <FeatureBox
                          key={index}
                          delay={'.2s'}
                          title={data.name}
                          description={data.description}
                          ownerAddress={data.owner}
                          marketID={data.id}
                          onClick={handleFeatureBoxClick}
                        />
                      ))
                    ) : (
                      <p>No market data available</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layout>
  )
}

export default ViewM