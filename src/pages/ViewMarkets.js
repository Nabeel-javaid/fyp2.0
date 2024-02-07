import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FeatureBox from '../components/FeatureBox';
import { createClient } from '@supabase/supabase-js';
import Typography from '@material-ui/core/Typography';
import Pagination from '@mui/material/Pagination';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const ViewMarkets = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketCount, setMarketCount] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [assetClassFilter, setAssetClassFilter] = useState(null);

  useEffect(() => {
    const loadMarketData = async () => {
      let query = supabase.from('Markets').select('*');

      if (statusFilter === 'Closed') {
        query = query.eq('isClosed', 'True');
      }
      if (statusFilter === 'Open') {
        query = query.eq('isClosed', 'False');
      }

      if (assetClassFilter === 'Loan') {
        query = query.eq('Type', 'Loan');
      }
      if (assetClassFilter === 'Wholesale') {
        query = query.eq('Type', 'Wholesale');
      }
      if (assetClassFilter === 'Asset') {
        query = query.eq('Type', 'Asset');
      }

      const { data: Markets, error } = await query;

      if (error) {
        setError('Error loading data from blockchain. Please try again later.');
      } else {
        setMarketCount(Markets.length);
        setMarketData(Markets);
        setLoading(false);
      }
    };

    loadMarketData();
  }, [statusFilter, assetClassFilter]);

  const handleFeatureBoxClick = (marketID) => {
    const selectedMarket = marketData.find((market) => market.id === marketID);

    if (selectedMarket) {
      const marketStatus = selectedMarket.isClosed ? 'Closed' : 'Open';

      if (marketStatus === 'Closed') {
        // Market is closed, display warning alert
        alert("This market is closed and can't be used for trading.");
      } else {
        // Market is open, navigate to the market page
        console.log("Open market ", marketID);
        window.location.href = `./market/${marketID}`;
      }
    };
  };

  const marketsPerPage = 9;
  const indexOfLastMarket = currentPage * marketsPerPage;
  const indexOfFirstMarket = indexOfLastMarket - marketsPerPage;
  const currentMarkets = marketData.slice(indexOfFirstMarket, indexOfLastMarket);

  const totalPages = Math.ceil(marketData.length / marketsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    return () => {
      setStatusFilter(null);
      setAssetClassFilter(null);
    };
  }, []);

  return (
    <Layout>
      
      <div style={{ paddingTop: '10%', paddingLeft: '8%', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
        <Typography variant="h3" style={{ color: 'black', textAlign: 'center', marginTop: ' 15px' }}>
          <strong>Browse the <span style={{ color: 'Red' }}>Markets</span></strong>
        </Typography>

        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'flex-end',marginRight: '200%', marginTop: '20%' }}>

          <Autocomplete
            options={['Open', 'Closed']}
            getOptionLabel={(option) => option}
            value={statusFilter}
            onChange={(event, newValue) => setStatusFilter(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Status" variant="outlined" style={{ width: '120px' }} />
            )}
          />
          {/* <Autocomplete

            options={['Loan', 'Wholesale', 'Asset']}
            getOptionLabel={(option) => option}
            value={assetClassFilter}
            onChange={(event, newValue) => setAssetClassFilter(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Market Type" variant="outlined" style={{ width: '140px', height: '0px' }} />
            )}
          /> */}
        </div>


        <div className="feature section">
          <div className="container">
            <div className="row">
              {loading && <iframe title='Loading' src="https://lottie.host/embed/2bb1d9c7-c859-42c3-a978-47b8057e708f/u9sfk3p35s.json"></iframe>}
              {error && <p>{error}</p>}
              {marketCount !== null && !loading && !error && (
                currentMarkets.length > 0 ? (
                  currentMarkets.map((data, index) => (
                    <FeatureBox
                      key={index}
                      delay={'0s'}
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
            <div style={{ textAlign: 'center', marginTop: '20px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewMarkets;
