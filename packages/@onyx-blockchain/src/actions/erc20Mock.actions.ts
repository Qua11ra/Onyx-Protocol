import { ERC20MOCK_CONTRACT } from "../contracts/tools-contracts";
import {writeContract} from "wagmi/actions"
import config from "@/index"
import { ERC20MintParams, ERC20ApproveParams } from "@/types/erc20MockActions.types";

export async function approve({
	account,
	mockAddress,
	address,
	amount
}: ERC20ApproveParams) {
	return writeContract(config, {
		address: mockAddress as `0x${string}`,
		abi: ERC20MOCK_CONTRACT.abi,
		functionName: "approve",
		args: [address as `0x${string}`, BigInt(amount)],
		account: account as `0x${string}`,
	});
}

export async function mint({
	account,
	mockAddress,
	address,
	amount,
}: ERC20MintParams) {
	return writeContract(config, {
		address: mockAddress as `0x${string}`,
		abi: ERC20MOCK_CONTRACT.abi,
		functionName: "mint",
		args: [address as `0x${string}`, BigInt(amount)],
		account: account as `0x${string}`,
	});
}