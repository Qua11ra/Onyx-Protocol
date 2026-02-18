export type burnOnyxTokenParams = {
    account: string;
    amountToBurn: string;
};
export type redeemCollateralParams = {
    account: string;
    collateralAddress: string;
    collateralAmount: string;
};

export type redeemCollateralAndBurnOnyxTokensParams = redeemCollateralParams & burnOnyxTokenParams

export type mintOnyxTokenParams = {
    account: string;
    amount: string;
}

export type depositeCollateralParams = {
    account: string;
    collateralAddress: string;
    collateralAmount: string;
};

export type depositeAndMintParams = Omit<mintOnyxTokenParams & depositeCollateralParams, "amount">

export type liquidateParams = {
    account: string;
    userAddress: string;
    collateralAddress: string;
    amountToLiquidate: string;
}


export type getAccountInformationParams = {
    userAddress: string;
}