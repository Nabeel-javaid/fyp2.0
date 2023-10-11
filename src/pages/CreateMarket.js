import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CountryList from "react-select-country-list";
import Layout from '../Layout/Layout';
import InboxIcon from '@mui/icons-material/Inbox';
import {
  FormControl,
  InputLabel,
  Button as MUIButton,
  Grid,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DropzoneArea } from "mui-file-dropzone";
import "./Styles/CreateMarket.css";


import contractABI from '../ABIs/marketRegistery.json'; // Adjust the path as per your project structure

const CreateMarket = () => {

  const [country, setCountry] = useState("");
  const [marketName, setMarketName] = useState("");
  const [marketType, setMarketType] = useState("");
  const [assetClass, setAssetClass] = useState("");
  const [website, setWebsite] = useState("");
  const [dataRoomLink, setDataRoomLink] = useState("");
  const [loanRequestsExpire, setLoanRequestsExpire] = useState("");
  const [loanPaymentCycle, setLoanPaymentCycle] = useState("");
  const [defaultLoans, setDefaultLoans] = useState("");
  const [loanProcessFee, setLoanProcessFee] = useState("");
  const [marketDescription, setMarketDescription] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [page, setPage] = useState(3);
  const [hasInput, setHasInput] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isToolOpen, setisToolOpen] = useState(false);
  const [heading, setHeading] = useState("RULES");

  const countryOptions = CountryList().getData();

  const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setHeading((prevHeading) => (prevHeading === "RULES" ? "MARKET" : "RULES"));
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);










  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Connect to the Ethereum provider (MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get the signer (account) from the provider
      const signer = provider.getSigner();

      // Load the contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const userAddress = await signer.getAddress();

      const txResponse = await contract.createMarket(
        userAddress,
        parseInt(loanPaymentCycle),
        parseInt(defaultLoans),
        parseInt(loanRequestsExpire),
        parseInt(loanProcessFee),
        false,
        false,
        " "
      );

      await txResponse.wait();

      // Display a success message
      toast.success("Market function called successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error calling market function. Please try again.");
    }
  };

  const handleNext = () => {
    if (
      page === 1 &&
      (!country ||
        !marketName ||
        !marketType ||
        !assetClass ||
        !website ||
        !dataRoomLink)
    ) {
      setHasInput(true);
      return;
    }
    if (
      page === 2 &&
      (!loanRequestsExpire ||
        !loanPaymentCycle ||
        !defaultLoans ||
        !loanProcessFee)
    ) {
      setHasInput(true);
      return;
    }
    setPage(page + 1);
    setHasInput(false);
  };

  const handleBack = () => {
    setPage(page - 1);
  };

  const handleImageUpload = (info) => {
    console.log(info);
  };

  const handleTermsAcceptance = () => {
    setTermsAccepted(!termsAccepted);
  };

  const handleCancel = () => {
    if (
      country ||
      marketName ||
      marketType ||
      assetClass ||
      website ||
      dataRoomLink ||
      loanRequestsExpire ||
      loanPaymentCycle ||
      defaultLoans ||
      loanProcessFee ||
      marketDescription ||
      termsAccepted
    ) {
      setHasInput(true);
      setCancelDialogOpen(true);
    } else {
      setPage(1);
    }
  };

  const handleCancelConfirm = () => {
    setPage(1);
    setHasInput(false);
    setCancelDialogOpen(false);
  };

  const handleCancelCancel = () => {
    setCancelDialogOpen(false);
  };

  return (
    <Layout>
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ minHeight: "100vh", marginLeft: "80px" }}
        className="MarketFormContainer"
      >
        <Grid item xs={6} md={6}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              width: "100%",
              animation: "fadeInOut 1s infinite",
            }}
          >
            <Typography
              variant="h3"
              style={{
                display: "flex",
                fontWeight: "bold",
                color: "white",
                justifyContent: "center",
                marginLeft: "49px",
                alignItems: "center",
              }}
            >
              You make the
              <span
                style={{
                  display: "flex",
                  color: heading === "RULES" ? "#FFEB3B" : "#2196F3",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                {heading}
              </span>
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              width: "fit-content",
            }}
          >
            <Typography
              variant="body1"
              style={{ color: "black", marginRight: "10px" }}
            >
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; These rules impact the borrower’s experience.
            </Typography>
            <Typography variant="body1" style={{ color: "black" }}>
              All selections made here can be updated in Settings later.
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            {page === 1 && (
              <Grid container spacing={2} className="custom-grid">
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    sx={{ m: 6, minWidth: 200, marginTop: "1rem" }}
                    style={{ marginBottom: "1rem", width: "70%" }}
                  >
                    <InputLabel id="demo-simple-select-label">Country</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      MenuProps={{
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      {countryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Market Name"
                    margin="normal"
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value)}
                    required
                    style={{ marginBottom: "1rem", width: "70%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    style={{ marginBottom: "1rem", width: "70%" }}
                  >
                    <InputLabel>Market Type</InputLabel>
                    <Select
                      label="Market Type"
                      value={marketType}
                      onChange={(e) => setMarketType(e.target.value)}
                      MenuProps={{
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        getContentAnchorEl: null,
                      }}
                    >
                      <MenuItem value="wholesale">Wholesale</MenuItem>
                      <MenuItem value="loan">Loan</MenuItem>
                      <MenuItem value="asset">Asset</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Asset Class"
                    value={assetClass}
                    onChange={(e) => setAssetClass(e.target.value)}
                    margin="normal"
                    required
                    className="MarketFormTextField"
                    style={{ width: "70%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    margin="normal"
                    required
                    className="MarketFormTextField"
                    style={{ width: "70%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Data Room Link"
                    value={dataRoomLink}
                    onChange={(e) => setDataRoomLink(e.target.value)}
                    margin="normal"
                    required
                    className="MarketFormTextField"
                    style={{ width: "70%" }}
                  />
                </Grid>
              </Grid>
            )}

            {page === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { pointerEvents: "auto" } }}
                    label={
                      <div>
                        Loan Requests Expire
                        <Tooltip title="Add some data">
                          <InfoIcon
                            disableFocusListener
                            disableTouchListener
                            color="primary"
                            style={{ marginLeft: "5px", fontSize: "16px" }}
                          />
                        </Tooltip>
                      </div>
                    }
                    value={loanRequestsExpire}
                    onChange={(e) => setLoanRequestsExpire(e.target.value)}
                    margin="normal"
                    required
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { pointerEvents: "auto" } }}
                    label={
                      <>
                        Loan Payment Cycle
                        <Tooltip
                          title="The amount of time, after a loan is considered late, a loan should go into default and can be liquidated"
                          open={isToolOpen}
                          onClose={() => {
                            setisToolOpen(false);
                          }}
                          onOpen={() => {
                            console.debug("kkkkkkkk");
                            setisToolOpen(true);
                          }}
                        >
                          <InfoIcon
                            color="primary"
                            style={{ marginLeft: "5px", fontSize: "16px" }}
                          />
                        </Tooltip>
                      </>
                    }
                    value={loanPaymentCycle}
                    onChange={(e) => setLoanPaymentCycle(e.target.value)}
                    margin="normal"
                    required
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { pointerEvents: "auto" } }}
                    label={
                      <div>
                        Default Loans
                        <Tooltip title="The amount of time, after a loan is considered late, a loan should go into default and can be liquidated">
                          <InfoIcon
                            color="primary"
                            style={{ marginLeft: "5px", fontSize: "16px" }}
                          />
                        </Tooltip>
                      </div>
                    }
                    value={defaultLoans}
                    onChange={(e) => setDefaultLoans(e.target.value)}
                    margin="normal"
                    required
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { pointerEvents: "auto" } }}
                    label={
                      <div>
                        Loan Process Fee
                        <Tooltip title="Information about Loan Process Fee">
                          <InfoIcon
                            color="primary"
                            style={{ marginLeft: "5px", fontSize: "16px" }}
                          />
                        </Tooltip>
                      </div>
                    }
                    value={loanProcessFee}
                    onChange={(e) => setLoanProcessFee(e.target.value)}
                    margin="normal"
                    required
                    type="number"
                    inputProps={{ max: 100 }}
                  />
                </Grid>
              </Grid>
            )}

            {page === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className="upload-container">
                    <DropzoneArea
                      dropzoneText={"Supports single file upload"}
                      filesLimit={1}
                      onChange={handleImageUpload}
                      Icon={InboxIcon}
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Market Description"
                    value={marketDescription}
                    onChange={(e) => setMarketDescription(e.target.value)}
                    margin="normal"
                    required
                    multiline
                    style={{ width: "70%" }}
                  />
                </Grid>
              </Grid>
            )}

            {page === 4 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h2 style={{ fontWeight: "bold" }}>Terms of Service</h2>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={handleTermsAcceptance}
                        color="primary"
                      />
                    }
                    label="I accept the terms of service."
                  />
                </Grid>
              </Grid>
            )}

            {hasInput && (
              <Typography variant="body2" color="error">
                Please fill in all fields.
              </Typography>
            )}

            <div style={{ marginTop: "12px" }}>
              {page > 1 && (
                <MUIButton
                  type="button"
                  onClick={handleBack}
                  variant="outlined"
                  color="primary"
                  style={{ borderRadius: "30px", padding: "10px 30px" }}
                >
                  <ArrowBackIcon /> Back
                </MUIButton>
              )}
              {page < 4 && (
                <MUIButton
                  type="button"
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "30px",
                    padding: "10px 30px",
                    marginLeft: "10px",
                  }}
                >
                  {`Continue ${page} of 4`}
                </MUIButton>
              )}
              {page === 4 && (
                <MUIButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: "30px",
                    padding: "10px 30px",
                    marginLeft: "10px",
                  }}
                >
                  Submit
                </MUIButton>
              )}
              <MUIButton
                type="button"
                onClick={handleCancel}
                variant="outlined"
                color="primary"
                style={{
                  borderRadius: "30px",
                  padding: "10px 30px",
                  marginLeft: "10px",
                  alignSelf: "flex-end",
                }}
              >
                Cancel
              </MUIButton>
            </div>
          </form>

        </Grid>
        <Grid item xs={6} md={6}>
          <img
            src="https://v2.teller.org/assets/teller_v2_Step3.0c1ebb64.svg"
            alt="Form Illustration"
            style={{ width: "60%", marginTop: "25%" }}
          />
        </Grid>
        <Dialog open={cancelDialogOpen} onClose={handleCancelCancel}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <p>You have unsaved changes. Are you sure you want to cancel?</p>
          </DialogContent>
          <DialogActions>
            <MUIButton onClick={handleCancelCancel} color="primary">
              No
            </MUIButton>
            <MUIButton onClick={handleCancelConfirm} color="primary">
              Yes
            </MUIButton>
          </DialogActions>
        </Dialog>
      </Grid>
    </Layout>
  )
}

export default CreateMarket;