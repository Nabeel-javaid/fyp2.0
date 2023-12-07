import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import { Button, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled as makeStyles } from '@mui/system';
import Pagination from '@mui/material/Pagination';
import '../css/main.css';

import Avatar from "./avatar.jpg";


const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  actionButtons: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  dialog: {
    padding: theme.spacing(2),
  },
  loanDetailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    marginTop: '10px',
  },
  
  loanImage: {
    width: '100%',
    height: '410px',
    objectFit: 'cover',
    borderRadius: '15px',
  },

  progressBarContainer: {
    position: 'relative',
    width: '100%',
    height: '5px',
    backgroundColor: '#3a3a43',
    marginTop: '2px',
  },

  progressBar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#4acd8d',
  },

  countBoxContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    gap: '30px',
  },
}));

const ViewLoan = () => {
    const classes = useStyles();
  const [loansData, setLoansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const loansPerPage = 6;

  const MID = useParams();

  useEffect(() => {
    const loadLoans = async () => {
      const { data: LoanBid, error } = await supabase
        .from('LoanBid')
        .select('*')
        .match({ MarketplaceID: MID.market });

      if (error) {
        setError('Error loading loans. Please try again later.');
      } else {
        setLoading(false);
        setLoansData(LoanBid);
      }
    };

    loadLoans();
  }, [MID]);

  const handleLoanDetailsClick = (loan) => {
    setSelectedLoan(loan);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const acceptLoan = (loanID) => {
    console.log(`Loan ${loanID} accepted`);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = loansData.slice(indexOfFirstLoan, indexOfLastLoan);

  const totalPages = Math.ceil(loansData.length / loansPerPage);

  const renderLoans = () => {
    return (
      <div className="row">
        {currentLoans.map((data, index) => (
          <div style={{ width: '30%', marginBottom: '16px' }} key={`loan-${index}`}>
            <Paper
              style={{
                padding: '16px',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => handleLoanDetailsClick(data)}
              elevation={3}
            >

              <img src={Avatar} alt="loan" style={{ width: '100%', height: '158px', objectFit: 'cover', borderRadius: '15px', marginBottom: '12px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '12px' }}>
                  <p style={{ marginLeft: '12px', marginTop: '12px', fontFamily: 'epilogue', fontWeight: 'medium', fontSize: '12px', color: '#808191' }}>
                    {data.MetadataURI}
                  </p>
                </div>
  
                <div style={{ display: 'block' }}>
                  <h3 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '16px', color: 'white', textAlign: 'left', lineHeight: '26px', marginBottom: '5px' }}>
                    APR: {data.APR}
                  </h3>
                  <p style={{ marginTop: '5px', fontFamily: 'epilogue', fontWeight: 'normal', fontSize: '12px', color: '#808191', textAlign: 'left', lineHeight: '18px' }}>
                    Principal: {data.Principal}
                  </p>
                </div>
  
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '15px', gap: '2px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '15px', color: '#b2b3bd', lineHeight: '22px' }}>{data.CollateralAmount}</h4>
                    <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'normal', fontSize: '12px', color: '#808191', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      amount of {data.CollateralAddress}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '15px', color: '#b2b3bd', lineHeight: '22px' }}>{data.Duration}</h4>
                    <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'normal', fontSize: '12px', color: '#808191', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Seconds
                    </p>
                  </div>
                </div>
  
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '12px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#13131a' }}>
                    <img src={Avatar} alt="user" className="w-1/2 h-1/2 object-contain" />
                  </div>
                  {/* <p style={{ flex: '1', fontFamily: 'epilogue', fontWeight: 'normal', fontSize: '12px', color: '#808191', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    by <span style={{ color: '#b2b3bd' }}>{data.RecieverAddress}</span>
                  </p> */}
                  <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'normal', fontSize: '12px', color: '#808191', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    by {data.RecieverAddress}
                  </p>
                </div>
              </div>
            </Paper>
          </div>
        ))}
      </div>
    );
  };

  const renderLoanDetailsDialog = () => (
    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle style={{ background: '#4f4f4f', color: 'white' }}>Loan Details</DialogTitle>
      <DialogContent className={classes.dialog} dividers style={{ background: '#272727', color: 'white' }}>
        {selectedLoan && (
          <>
            {/* Status Indicator */}
            <div
              className="status-indicator"
              style={{
                color: selectedLoan.Status === 'Pending' ? 'green' : 'red',
                textAlign: 'right',
                display: 'flex-right',
              }}
            >
              {selectedLoan.Status}
            </div>
  
            {/* Loan Details */}
            <Typography variant="body1">
              <strong>Receiver Address:</strong> {selectedLoan.RecieverAddress}
            </Typography>
            <Typography variant="body1">
              <strong>Borrower Address:</strong> {selectedLoan.BorrowerAddress}
            </Typography>
            <Typography variant="body1">
              <strong>APR:</strong> {selectedLoan.APR}
            </Typography>
            <Typography variant="body1">
              <strong>Duration:</strong> {selectedLoan.Duration}
            </Typography>
            <Typography variant="body1">
              <strong>Principal:</strong> {selectedLoan.Principal}
            </Typography>
            <Typography variant="body1">
              <strong>Collateral Type:</strong> {selectedLoan.CollateralType}
            </Typography>
            <Typography variant="body1">
              <strong>Collateral Amount:</strong> {selectedLoan.CollateralAmount}
            </Typography>
            <Typography variant="body1">
              <strong>Collateral Address:</strong> {selectedLoan.CollateralAddress}
            </Typography>
  
            {/* Divider */}
            <hr style={{ margin: '16px 0', borderColor: '#5f5f5f' }} />
  
            {/* Lender Details */}
            <DialogTitle style={{ background: '#4f4f4f', color: 'white' }}>Lender Details</DialogTitle>
            <DialogContent className={classes.dialog} dividers style={{ background: '#272727', color: 'white' }}>
              {selectedLoan.LenderAddress === null ? (
                <Typography variant="h5">Not yet accepted</Typography>
              ) : (
                <>
                  <Typography variant="body1">
                    <strong>Lender Address:</strong> {selectedLoan.LenderAddress}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Loan Lent at:</strong> {selectedLoan.LoanLendTime}
                  </Typography>
                </>
              )}
            </DialogContent>
          </>
        )}
      </DialogContent>
      <DialogActions style={{ background: '#4f4f4f', justifyContent: 'center' }}>
        <Button onClick={handleCloseDialog} color="primary" variant="contained">
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => acceptLoan(selectedLoan?.LoanID)}
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
  

  return (
    <Layout>
      <div style={{ paddingTop: '10%' }}>
        <Typography variant="h3" style={{ color: 'black', textAlign: 'center' }}>
          <strong>Loans in Market</strong>
        </Typography>

        <div className="feature section">
          <div className="container">
            {loading && (
              <iframe
                title="Loading"
                src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json"
              ></iframe>
            )}
            {error && <p>{error}</p>}
            {!loading && loansData.length > 0 ? (
              renderLoans()
            ) : (
              <div className="col-md-12 col-sm-12">
                <div className="feature-box">
                  <div className="icon">
                    <i className="lni lni-rocket"></i>
                  </div>
                  <Typography variant="h5">There are no loans available</Typography>
                </div>
              </div>
            )}

            <div className={classes.pagination}>
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                />
              )}
            </div>
            {/* Loan Details Dialog */}
            {renderLoanDetailsDialog()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewLoan;
