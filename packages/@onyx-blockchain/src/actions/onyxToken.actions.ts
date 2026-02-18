import { ONYX_TOKEN_CONTRACT } from "../contracts/onyx-contracts";
import { writeContract } from "wagmi/actions";
import config from "@/index";
import { OnyxTransferParams, OnyxTransferFromParams, OnyxApproveParams } from "@/types/onyxTokenActions.types";

export async function approve({account, address, amount}: OnyxApproveParams) {
    return writeContract(config, {
		address: ONYX_TOKEN_CONTRACT.address as `0x${string}`,
		abi: ONYX_TOKEN_CONTRACT.abi,
		functionName: "approve",
		args: [address as `0x${string}`, BigInt(amount)],
		account: account as `0x${string}`,
	});
}

export async function transfer({account, address, amount}: OnyxTransferParams) {
    return writeContract(config, {
		address: ONYX_TOKEN_CONTRACT.address as `0x${string}`,
		abi: ONYX_TOKEN_CONTRACT.abi,
		functionName: "transfer",
		args: [address as `0x${string}`, BigInt(amount)],
		account: account as `0x${string}`,
	});
}

export async function transferFrom({
	account,
    address,
	from,
	to,
	amount
}: OnyxTransferFromParams) {
	return writeContract(config, {
		address: ONYX_TOKEN_CONTRACT.address as `0x${string}`,
		abi: ONYX_TOKEN_CONTRACT.abi,
		functionName: "transferFrom",
		args: [from as `0x${string}`, to as `0x${string}`, BigInt(amount)],
		account: account as `0x${string}`,
	});
}