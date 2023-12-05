import {React, useEffect, useState} from 'react';
import Layout from "../components/Layout";
// import LoanBar from "../components/LoanBar";
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import {Button} from '@mui/material';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const ViewLoan = () => {

  const [loansData, setLoansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MID = useParams();
  

  useEffect(() => {
    const loadLoans = async() => {
      const { data: LoanBid, error} = await supabase
      .from('LoanBid')
      .select('*')
      .match({ MarketplaceID: MID.market });

      if (error) {
        setError("Error loading loans. Please try again later.");
      }
      else {
        setLoading(false);
        setLoansData(LoanBid);
      }
    }

    loadLoans();
  }, [ ]);

  const acceptLoan = () => {
    console.log("Accepted");
  }

  const declineLoan = () => {
    console.log("Declined");
  }

  return (
    <Layout>
      <hr />
        <div style={{ paddingTop: '10%' }}>
          <div className="feature section">
            <div className="container">
              <div className="row">
                {loading && <iframe title='Loading' src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json"></iframe>}
                {error && <p>{error}</p>}                
                { !loading && !error && loansData.length > 0 ? (
                  loansData.map((data, index) => (
                    <div className="col-md-12 col-sm-12">
                      <div className="feature-box">
                        <div className="icon">
                          <i className="lni lni-rocket"></i>
                        </div>
                        <h4>{data.LoandID}</h4>
                        <p>{data.RecieverAddress}</p>
                        <p>Status: {data.Status}</p>

                        <div className="action-buttons">
                          <Button 
                            variant="contained" 
                            color="primary" 
                            className="action-button"
                            onClick={acceptLoan}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            className="action-button"
                            onClick={declineLoan}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>                   
                    </div>
                  ))
                )
                : (
                  <div className="col-md-12 col-sm-12">
                    <div className="feature-box">
                      <div className="icon">
                        <i className="lni lni-rocket"></i>
                      </div>
                      <h4>There are no loans available</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default ViewLoan