export type OnyxApproveParams = {
    account: string;
    address: string;
    amount: string;
}

export type OnyxTransferFromParams = {
    account: string;
    address: string;
    from: string;
    to: string;
    amount: string;
}

export type OnyxTransferParams = Omit<OnyxTransferFromParams, "from" | "to">