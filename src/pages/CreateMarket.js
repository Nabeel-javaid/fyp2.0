import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3 from 'web3';
import { Paper } from '@material-ui/core';
import ScaleLoader from "react-spinners/ScaleLoader";

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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Layout from "../components/Layout";


import contractABI from "../ABIs/marketRegistery.json";
import NewMarket from "../ABIs/store/NewMarket";





const CreateMarket = () => {
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
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [isToolOpen, setisToolOpen] = useState(false);
    const [heading, setHeading] = useState("RULES");
    const [isMobileView, setIsMobileView] = useState(false);
    const [errors, setErrors] = useState({});

    const contractAddress = '0xad9ace8a1ea7267dc2ab19bf4b10465d56d5ecf0';


    const randomTerms = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Pellentesque vel orci vitae sapien varius congue.",
        "In nec nisl sed tortor luctus gravida.",
        "Fusce eget dolor et justo bibendum laoreet.",
        "Nullam feugiat tortor et leo dignissim, in tincidunt quam tempus.",
    ];



    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobileView(true);
            } else {
                setIsMobileView(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeout(() => {
                setHeading((prevHeading) =>
                    prevHeading === "RULES" ? "MARKET" : "RULES"
                );
            }, 1000);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading


        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );
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
            console.log("Market added successfully!");

            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const marketContract = new web3.eth.Contract(contractABI, contractAddress);
            const marketID = await marketContract.methods.marketCount().call();

            const ID = Number(marketID);

            console.log("Market ID", typeof (ID));
            console.log("Market Name", typeof (marketName));
            console.log("Market Description", typeof (marketDescription));
            console.log("User Address", typeof (userAddress));

            await NewMarket(ID, marketName, marketDescription, userAddress);
            setIsLoading(false); // Stop loading on success
        } catch (error) {
            setIsLoading(false); // Stop loading on error
            console.error("Error adding market:", error);
        }
    };

    const validate = () => {
        let tempErrors = {};
        if (page === 1) {
            tempErrors.marketName = marketName ? "" : "This field is required.";
            tempErrors.marketType = marketType ? "" : "This field is required.";
            tempErrors.marketDescription = marketDescription ? "" : "This field is required.";
            tempErrors.assetClass = assetClass ? "" : "This field is required.";
            tempErrors.website = website ? "" : "This field is required.";
            tempErrors.dataRoomLink = dataRoomLink ? "" : "This field is required.";
        } else if (page === 2) {
            if (loanProcessFee === "") {
                tempErrors.loanProcessFee = "This field is required.";
            } else if (loanProcessFee < 0 || loanProcessFee > 100) {
                tempErrors.loanProcessFee = "Fee must be between 0% and 100%.";
            }

            if (defaultLoans === "") {
                tempErrors.defaultLoans = "This field is required.";
            } else if (defaultLoans < 1000) {
                tempErrors.defaultLoans = "The minimum amount of default loans is 1000.";
            }

            if (loanPaymentCycle === "") {
                tempErrors.loanPaymentCycle = "This field is required.";
            } else if (loanPaymentCycle < 1) {
                tempErrors.loanPaymentCycle = "Duration of Loan Payment Cycle must be greater than 1.";
            }

            if (loanRequestsExpire === "") {
                tempErrors.loanRequestsExpire = "This field is required.";
            } else if (loanRequestsExpire < 1) {
                tempErrors.loanRequestsExpire = "Duration of Loan request must be greater than 1.";
            }

            tempErrors.termsAccepted = termsAccepted ? "" : "You must accept the terms of service.";

        }

        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleNext = () => {
        if (!validate()) {
            return;
        }

        setPage(page + 1);

    };

    const handleBack = () => {
        setPage(page - 1);
    };


    const handleTermsAcceptance = () => {
        setTermsAccepted(!termsAccepted);
    };

    const handleCancel = () => {
        if (
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
            setCancelDialogOpen(true);
        } else {
            setPage(1);
        }
    };

    const handleCancelConfirm = () => {
        setPage(1);
        setCancelDialogOpen(false);
    };

    const handleCancelCancel = () => {
        setCancelDialogOpen(false);
    };

    return (
        <Layout>
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ScaleLoader color={"#123abc"} loading={isLoading} size={22} />

                </div>
            )}
            <Grid
                container
                justify="center"
                alignItems="center"
                style={{
                    minHeight: "100vh",
                    marginLeft: isMobileView ? "0" : "80px",
                    paddingTop: "5rem",
                    paddingBottom: "5rem",
                }}
                className="MarketFormContainer"
            >
                <Grid item xs={12} md={6}>
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
                                color: "black",
                                justifyContent: "center",
                                marginLeft: "49px",
                                alignItems: "center",
                            }}
                        >
                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; You make the
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
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Market Name"
                                        margin="normal"
                                        value={marketName}
                                        onChange={(e) => setMarketName(e.target.value)}
                                        style={{ width: "70%", marginLeft: "35px" }}

                                        error={Boolean(errors.marketName)}
                                        helperText={errors.marketName}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Market Description"
                                        margin="normal"
                                        value={marketDescription}
                                        onChange={(e) => setMarketDescription(e.target.value)}
                                        style={{ marginBottom: "1rem", width: "70%" }}
                                        error={Boolean(errors.marketDescription)}
                                        helperText={errors.marketDescription}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        style={{ marginBottom: "1rem", width: "70%", marginLeft: "35px" }}
                                    >
                                        <InputLabel
                                            style={{ paddingLeft: "0.1rem" }}
                                        >
                                            Market Type
                                        </InputLabel>
                                        <Select
                                            label="Market Type"
                                            value={marketType}
                                            onChange={(e) => setMarketType(e.target.value)}
                                            error={Boolean(errors.marketType)}
                                            helperText={errors.marketType}
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
                                        className="MarketFormTextField"
                                        style={{ width: "70%" }}
                                        error={Boolean(errors.assetClass)}
                                        helperText={errors.assetClass}
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
                                        className="MarketFormTextField"
                                        style={{ width: "70%", marginLeft: "35px" }}
                                        InputLabelProps={{
                                            style: {
                                                paddingLeft: "0.1rem"
                                            }
                                        }}
                                        error={Boolean(errors.website)}
                                        helperText={errors.website}
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
                                        className="MarketFormTextField"
                                        style={{ width: "70%" }}
                                        error={Boolean(errors.dataRoomLink)}
                                        helperText={errors.dataRoomLink}
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
                                        InputLabelProps={{ style: { pointerEvents: "auto", paddingLeft: "0.1rem" } }}
                                        label={
                                            <div>
                                                Loan Requests Expire
                                                <Tooltip title="Add some data">
                                                    <InfoIcon
                                                        disableFocusListener
                                                        disableTouchListener
                                                        color="primary"
                                                        style={{ marginLeft: "5px", fontSize: "16px", }}

                                                    />
                                                </Tooltip>
                                            </div>
                                        }
                                        value={loanRequestsExpire}
                                        onChange={(e) => setLoanRequestsExpire(e.target.value)}
                                        margin="normal"
                                        type="number"
                                        style={{ width: "70%", marginLeft: "50px" }}
                                        error={Boolean(errors.loanRequestsExpire)}
                                        helperText={errors.loanRequestsExpire}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ style: { pointerEvents: "auto" } }}
                                        style={{ width: "70%", marginLeft: "30px" }}
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
                                        error={Boolean(errors.loanPaymentCycle)}
                                        helperText={errors.loanPaymentCycle}
                                        margin="normal"
                                        type="number"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ style: { pointerEvents: "auto", paddingLeft: "0.1rem" } }}
                                        style={{ width: "70%", marginLeft: "50px" }}
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
                                        type="number"
                                        inputProps={{min: 0 }}  // Set the minimum value to 0
                                        error={Boolean(errors.defaultLoans)}
                                        helperText={errors.defaultLoans}


                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ style: { pointerEvents: "auto", paddingLeft: "0.1rem" } }}
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
                                        type="number"
                                        inputProps={{ max: 100, min: 0 }}  // Set the minimum value to 0
                                        style={{ width: "70%", marginLeft: "30px" }}
                                        error={Boolean(errors.loanProcessFee)}
                                        helperText={errors.loanProcessFee}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={8} md={6} style={{ marginLeft: '130px' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={termsAccepted}
                                                onChange={handleTermsAcceptance}
                                                color="primary"
                                                error={Boolean(errors.termsAccepted)}
                                            />
                                        }
                                        label="I accept the terms of service."
                                    />
                                    {errors.termsAccepted && (
                                        <Typography variant="body2" color="error">
                                            {errors.termsAccepted}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        )}

                        <Grid container spacing={2} >
                            {page === 3 && (
                                <Grid item xs={12} sm={8} md={6} style={{ marginLeft: '130px' }}>
                                    <Paper elevation={3} style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', border: '1px solid #ddd', width: '600px' }}>
                                        <h2 style={{ fontWeight: 'bold' }}>Terms of Service</h2>
                                        <ul>
                                            {randomTerms.map((term, index) => (
                                                <li key={index}>{term}</li>
                                            ))}
                                        </ul>
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
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>



                        <div style={{ marginTop: "12px", paddingLeft: "14rem", paddingTop: "3rem" }}>
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
                            {page < 3 && (
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
                                    {`Continue ${page} of 3`}
                                </MUIButton>
                            )}
                            {page === 3 && (
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
                        {isLoading && (
                            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                {/* <ScaleLoader color={"#123abc"} loading={isLoading} size={22} /> */}
                            </div>
                        )}
                    </form>
                </Grid>
                <Grid item xs={12} md={6}>
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