import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function CreateLoanBid(LTA, MID, Principal, Duration, APR, URI, RA, CType, CAmount, CAddress, Status, Borrower) {
    const lendingTokenAddress = LTA.toString();
    const marketID = MID.toString();
    const principal = Principal.toString();
    const duration = Duration.toString();
    const apr = APR.toString();
    const uri = URI.toString();
    const recipientAddress = RA.toString();
    const collateralType = CType.toString();
    const collateralAmount = CAmount.toString();
    const collateralAddress = CAddress.toString();
    const status = Status.toString();
    const borrowerAddress = Borrower.toString();

    const { data, error } = await supabase
        .from('LoanBid')
        .insert([
            {
                LendingTokenAddress: lendingTokenAddress,
                MarketplaceID: marketID,
                Principal: principal,
                Duration: duration,
                APR: apr,
                MetadataURI: uri,
                RecieverAddress: recipientAddress,
                CollateralType: collateralType,
                CollateralAmount: collateralAmount,
                CollateralAddress: collateralAddress,
                Status: status,
                BorrowerAddress: borrowerAddress
            },
        ]);

    console.log("Lending Token Address:", lendingTokenAddress, "|| Market ID:", marketID, "|| Principal:", principal, "|| Duration:", duration, "|| APR:", apr, "|| Metadata URI:", uri, "|| Recipient Address:", recipientAddress, "|| Collateral Type:", collateralType, "|| Collateral Amount:", collateralAmount, "|| Collateral Address:", collateralAddress, "|| Status:", status, "|| Borrower Address:", borrowerAddress);

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Loan Bid Created');
    }
}