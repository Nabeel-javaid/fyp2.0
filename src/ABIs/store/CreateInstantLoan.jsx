import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function CreateInstantLoan(LTA, MID, Principal, Duration, APR, CType, CAmount, CAddress, Status, Lender) {
    const lendingTokenAddress = LTA.toString();
    const marketID = MID.toString();
    const principal = Principal.toString();
    const duration = Duration.toString();
    const apr = APR.toString();
    const collateralType = CType.toString();
    const collateralAmount = CAmount.toString();
    const collateralAddress = CAddress.toString();
    const status = Status.toString();
    const lenderAddress = Lender.toString();

    const { data, error } = await supabase
        .from('InstantLoanBid')
        .insert([
            {
                LendingTokenAddress: lendingTokenAddress,
                MarketplaceID: marketID,
                Principal: principal,
                Duration: duration,
                APR: apr,
                CollateralType: collateralType,
                CollateralAmount: collateralAmount,
                CollateralAddress: collateralAddress,
                Status: status,
                LenderAddress: lenderAddress
            },
        ]);

    console.log("Lending Token Address:", lendingTokenAddress, "|| Market ID:", marketID, "|| Principal:", principal, "|| Duration:", duration, "|| APR:", apr, "|| Collateral Type:", collateralType, "|| Collateral Amount:", collateralAmount, "|| Collateral Address:", collateralAddress, "|| Status:", status, "|| Lender Address:", lenderAddress);

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Loan Bid Created');
    }
}