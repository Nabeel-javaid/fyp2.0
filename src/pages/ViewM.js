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
                  {loading && <iframe title='Loading' src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json"></iframe>}
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
                        <iframe title='NoMarketData' src="https://lottie.host/?file=650d2381-d113-4865-80a7-5f8f3217c5b7/dUlOdERsRD.json"></iframe>
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