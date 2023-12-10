import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import { Button, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled as makeStyles } from '@mui/system';
import Pagination from '@mui/material/Pagination';
import ScaleLoader from 'react-spinners/ScaleLoader';
import '../css/main.css';
// import Web3 from 'web3';
import { ethers } from 'ethers';



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
    marginTop: 'theme.spacing(2)',

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
  const [acceptingLoan, setAcceptingLoan] = useState(false); // New state for loading during acceptance
  const [showAccepted, setShowAccepted] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
 


  const loansPerPage = 9;
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

  const loanImages = [
    'https://i.ibb.co/CzzXqK6/7xm-xyz648911.png',
    'https://i.ibb.co/71Smg2m/7xm-xyz113336.png',
    'https://i.ibb.co/sJVHJRC/ETH-in-air.png',
    'https://i.ibb.co/ZMwrKZV/Ethereum.png',
    'https://i.ibb.co/k88Xny4/7xm-xyz978597.png',
    'https://i.ibb.co/YBV8nCr/Vector-2646.jpg',
    'https://i.ibb.co/cN2vqMP/7xm-xyz786284.jpg',
  ];


  const handleLoanDetailsClick = (loan) => {
    setSelectedLoan(loan);
    setDialogOpen(true);
  };

  const toggleShowAcceptedLoans = () => {
    setShowAccepted((prevValue) => !prevValue);
   
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };



  
  // Function to filter loans based on their status
  const filterLoansByStatus = () => {
    let filteredLoans = loansData;

    if (filterStatus !== 'All') {
      filteredLoans = loansData.filter((loan) => {
        return filterStatus === 'Accepted' ? loan.Status === 'Accepted' : loan.Status === 'Pending';
      });
    }

    return (
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        {filteredLoans.map((data, index) => (
          
           <div key={`loan-${index}`} style={{ width: '30%', marginBottom: '16px', marginLeft: "20px", position: 'relative', top: '30px' }} >
            <Paper
              style={{
                padding: '16px',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#DCC7C2', // Add background color here
              }}
              onClick={() => handleLoanDetailsClick(data)}
              elevation={3}
            >
              <img
              src={loanImages[index % loanImages.length]} // Use the image based on the index
              alt={`Loan-${index}`}
              border="0"
              style={{ width: '100%', height: '158px', objectFit: 'cover', borderRadius: '15px', marginBottom: '12px' }}
            />

              <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '12px' }}>
                <div style={{ display: 'block' }}>
                  <h3 style={{ fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '18px', color: '#000000', textAlign: 'left', lineHeight: '30px', marginBottom: '5px' }}>
                    APR: <span style={{ color: '#000000', fontWeight: 'bold' }}>{data.APR}</span>
                  </h3>
                  <p style={{ marginTop: '5px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', textAlign: 'left', lineHeight: '22px' }}>
                    Principal: {data.Principal}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '15px', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '24px', color: '#000000', lineHeight: '24px' }}>{data.CollateralAmount}</h4>
                    <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      amount of {data.CollateralAddress}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '24px', color: '#000000', lineHeight: '24px' }}>{data.Duration}</h4>
                    <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Seconds
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#13131a' }}>
                    <img src="https://i.ibb.co/DL3dtSj/avatar2-0.png" border="0" alt="user" className="w-1/2 h-1/2 object-contain" />
                  </div>
                  <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    by {data.RecieverAddress}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div
                className="status-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: '6.8px', // Adjust the value as needed
                  color: data.Status === 'Pending' ? 'red' : 'green',
                  textAlign: 'right',
                  padding: '22px',
                  fontWeight: 'bold',
                }}
              >
                {data.Status}
              </div>
            </Paper>
          </div>
        
        ))}
      </div>
    );
  };


  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const acceptLoan = async (loanID) => {
    try {
      setAcceptingLoan(true); // Set loading state to true
      setDialogOpen(false); // Close the dialog after accepting the loan

      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const selectedLoan = loansData.find((loan) => loan.LoanID === loanID);
        const accounts = await provider.listAccounts();
        const senderAddress = accounts[0];

        if (!senderAddress) {
          console.error('MetaMask account not available');
          return;
        }

        const amountToSend = ethers.utils.parseEther(selectedLoan.Principal);

        console.log("amountToSend", selectedLoan.Principal);
        console.log("RecieverAddress", selectedLoan.RecieverAddress);
        console.log("senderAddress", senderAddress);



        const txEth = await signer.sendTransaction({
          to: selectedLoan.RecieverAddress,
          value: amountToSend,
        });

        await txEth.wait();

        // Update Supabase fields after successful transaction
        const { data: updatedLoan, error } = await supabase
          .from('LoanBid')
          .update({
            LenderAddress: senderAddress,
            LoanLendTime: new Date().toISOString(), // You might want to format this date according to your needs
            Status: 'Accepted', // Update the status to indicate that the loan is accepted
          })
          .eq('LoanID', loanID);

        if (error) {
          console.error('Error updating Supabase:', error);
          return;
        }

        setLoansData((prevLoans) => {
          return prevLoans.map((loan) =>
            loan.LoanID === loanID
              ? {
                ...loan,
                LenderAddress: senderAddress,
                LoanLendTime: new Date().toISOString(),
                Status: 'Accepted',
              }
              : loan
          );
        });

        setAcceptingLoan(false); // Set loading state back to false after loan acceptance

      } else {
        console.error('MetaMask not detected');
        setAcceptingLoan(false); // Set loading state to false in case of an error

      }
    } catch (error) {
      console.error('Error accepting loan:', error);
      setAcceptingLoan(false); // Set loading state to false in case of an error


    }
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
      <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ScaleLoader color={"#123abc"} loading={loading} size={22} />
          </div>
        )}

        {!loading && currentLoans.length > 0 && currentLoans.map((data, index) => (
          <div style={{ width: '30%', marginBottom: '16px', position: 'relative' }} key={`loan-${index}`}>
            <Paper
              style={{
                padding: '16px',
                borderRadius: '15px',
                cursor: 'pointer',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#DCC7C2', // Add background color here
              }}
              onClick={() => handleLoanDetailsClick(data)}
              elevation={3}
            >
              <img
                src={loanImages[index % loanImages.length]} // Use the image based on the index
                alt={`Loan-${index}`}
                border="0"
                style={{ width: '100%', height: '158px', objectFit: 'cover', borderRadius: '15px', marginBottom: '12px' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '12px' }}>
                <div style={{ display: 'block' }}>
                  <h3 style={{ fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '18px', color: '#000000', textAlign: 'left', lineHeight: '30px', marginBottom: '5px' }}>
                    APR: <span style={{ color: '#000000', fontWeight: 'bold' }}>{data.APR}</span>
                  </h3>
                  <p style={{ marginTop: '5px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', textAlign: 'left', lineHeight: '22px' }}>
                    Principal: {data.Principal}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: '15px', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '24px', color: '#000000', lineHeight: '24px' }}>{data.CollateralAmount}</h4>
                    <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      amount of {data.CollateralAddress}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontFamily: 'epilogue', fontWeight: 'semibold', fontSize: '24px', color: '#000000', lineHeight: '24px' }}>{data.Duration}</h4>
                    <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Seconds
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#13131a' }}>
                    <img src="https://i.ibb.co/DL3dtSj/avatar2-0.png" border="0" alt="user" className="w-1/2 h-1/2 object-contain" />
                  </div>
                  <p style={{ marginTop: '3px', fontFamily: 'epilogue', fontWeight: 'bold', fontSize: '14px', color: '#000000', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    by {data.RecieverAddress}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div
                className="status-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: '6.8px', // Adjust the value as needed
                  color: data.Status === 'Pending' ? 'Purple' : (data.Status === 'Accepted' ? 'Green' : 'Red'),
                  textAlign: 'right',
                  padding: '22px',
                  fontWeight: 'bold',
                }}
              >
                {data.Status}
              </div>

            </Paper>
          </div>
        ))}

        {!loading && currentLoans.length === 0 && (
          <div className="col-md-12 col-sm-12">
            <div className="feature-box">
              <div className="icon">
                <i className="lni lni-rocket"></i>
              </div>
              <Typography variant="h5">There are no loans available</Typography>
            </div>
          </div>
        )}
      </div>
    );
  };

  const liquidateLoan = async (loanID) => {
    try {
      setAcceptingLoan(true); // Set loading state to true
      setDialogOpen(false); // Close the dialog after accepting the loan

      if (window.ethereum) {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();


        const selectedLoan = loansData.find((loan) => loan.LoanID === loanID);
        const accounts = await provider.listAccounts();
        const senderAddress = accounts[0];

        if (!senderAddress) {
          console.error('MetaMask account not available');
          return;
        }

        const amountToSend = ethers.utils.parseEther(selectedLoan.Principal);

        const txEth = await signer.sendTransaction({
          to: selectedLoan.LenderAddress,
          value: amountToSend,
        });

        await txEth.wait();

        // Update Supabase fields after successful transaction
        const { data: updatedLoan, error } = await supabase
          .from('LoanBid')
          .update({
            Status: 'Liquidated', // Update the status to indicate that the loan is accepted
          })
          .eq('LoanID', loanID);

        if (error) {
          console.error('Error updating database:', error);
          return;
        }


        setLoansData((prevLoans) => {
          return prevLoans.map((loan) =>
            loan.LoanID === loanID
              ? {
                ...loan,
                Status: 'Liquidated',
              }
              : loan
          );
        });

        setAcceptingLoan(false); // Set loading state back to false after loan acceptance

      } else {
        console.error('MetaMask not detected');
        setAcceptingLoan(false); // Set loading state to false in case of an error

      }
    } catch (error) {
      console.error('Error accepting loan:', error);
      setAcceptingLoan(false); // Set loading state to false in case of an error


    }
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
                color: selectedLoan.Status === 'Pending' ? 'Purple' : (selectedLoan.Status === 'Accepted' ? 'Green' : 'Red'),
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
        {selectedLoan?.Status === 'Pending' ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => acceptLoan(selectedLoan?.LoanID)}
          >
            Accept
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => liquidateLoan(selectedLoan?.LoanID)}
            disabled={selectedLoan?.Status === 'Liquidated' || !isLiquidateEnabled(selectedLoan)}
          >
            {selectedLoan?.Status === 'Liquidated' ? 'Already Liquidated' : 'Liquidate'}
          </Button>

        )}
      </DialogActions>
    </Dialog>
  );

  const isLiquidateEnabled = (loan) => {
    if (!loan) {
      return false;
    }

    const loanEndTime = new Date(loan.LoanLendTime).getTime();
    const currentTime = new Date().getTime();
    const durationInSeconds = parseInt(loan.Duration, 10);

    // Calculate the time when liquidation is allowed
    const liquidationTime = loanEndTime + durationInSeconds * 1000;

    // Enable the button if the current time is equal to or greater than the liquidation time
    return currentTime >= liquidationTime;
  };

  const acceptedLoans = loansData.filter(loan => loan.Status === 'Accepted');
const pendingLoans = loansData.filter(loan => loan.Status === 'Pending');

  return (
    <Layout>
      <div style={{ paddingTop: '10%' }}>
        <Typography variant="h3" style={{ color: 'black', textAlign: 'center' }}>
          <strong>Loans in Market</strong>
        </Typography>

        <div>
      <select value={filterStatus} onChange={handleFilterChange}>
        <option value="All">Show All Loans</option>
        <option value="Accepted">Show Accepted Loans</option>
        <option value="Pending">Show Pending Loans</option>
      </select>
      {filterStatus === 'All' && loansData.length > 0 ? renderLoans() : null}
      {filterStatus === 'All' && loansData.length === 0 ? (
        <div className="col-md-12 col-sm-12">
          <div className="feature-box">
            <div className="icon">
              <i className="lni lni-rocket"></i>
            </div>
            <Typography variant="h5">There are no loans available</Typography>
          </div>
        </div>
      ) : null}
      
          

      
      {((filterStatus === 'Accepted' && acceptedLoans.length === 0) || (filterStatus === 'Pending' && pendingLoans.length === 0)) ? (
        <div className="col-md-12 col-sm-12">
          <div className="feature-box">
            <div className="icon">
              <i className="lni lni-rocket"></i>
            </div>
            <Typography variant="h5">There are no {filterStatus === 'Accepted' ? 'Accepted' : 'Pending'} loans available</Typography>
          </div>
        </div>
      ) : null}
      {filterStatus !== 'All' ? filterLoansByStatus() : null}
    </div>

        <div className="feature section">
          <div className="container">
            {acceptingLoan && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent', // Semi-transparent white background
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ScaleLoader color={"#123abc"} loading={acceptingLoan} size={22} />
              </div>
            )}

            {loading && (
              <iframe title="Loading" src="https://lottie.host/?file=474793e3-81ee-474c-bc0b-78562b8fa02e/dwOgWo0OlT.json"></iframe>
            )}
            {error && <p>{error}</p>}

            {/* {filterStatus === 'All' && loansData.length > 0 ? (
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
            )} */}

            <div className={classes.pagination} style={{ position: 'absolute', right: '45%', bottom: '7%' }}>
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
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