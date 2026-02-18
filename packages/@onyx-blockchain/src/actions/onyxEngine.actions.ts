import { useReadContracts } from "wagmi";
import { ONYX_ENGINE_CONTRACT } from "../contracts/onyx-contracts";
import { writeContract } from "wagmi/actions";
import config from "@/index";
import { redeemCollateralAndBurnOnyxTokensParams, burnOnyxTokenParams, depositeAndMintParams, depositeCollateralParams, liquidateParams, mintOnyxTokenParams, redeemCollateralParams, getAccountInformationParams } from "@/types/onyxEngineActions.types";

export async function redeemCollateralAndBurnOnyxTokens(
	{
		account,
		collateralAddress,
		collateralAmount,
		amountToBurn,
	}: redeemCollateralAndBurnOnyxTokensParams
) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "redeemCollateralAndBurnOnyxTokens",
		args: [
			collateralAddress as `0x${string}`,
			BigInt(collateralAmount),
			BigInt(amountToBurn),
		],
		account: account as `0x${string}`,
	});
}

export async function burnOnyxToken({account, amountToBurn}: burnOnyxTokenParams) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "burnOnyxToken",
		args: [BigInt(amountToBurn)],
		account: account as `0x${string}`,
	});
}

export function depositeAndMint({account, collateralAddress, collateralAmount}: depositeAndMintParams) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "depositCollateralAndMintOnyxTokens",
		args: [collateralAddress as `0x${string}`, BigInt(collateralAmount)],
		account: account as `0x${string}`,
	});
}

export async function depositCollateral(
	{account, collateralAddress, collateralAmount}: depositeCollateralParams
) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "depositCollateral",
		args: [collateralAddress as `0x${string}`, BigInt(collateralAmount)],
		account: account as `0x${string}`,
	});
}

export async function liquidate({
	account,
	userAddress,
	collateralAddress,
	amountToLiquidate,
}: liquidateParams) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "liquidate",
		args: [
			userAddress as `0x${string}`,
			collateralAddress as `0x${string}`,
			BigInt(amountToLiquidate),
		],
		account: account as `0x${string}`,
	});
}

export async function mintOnyxToken({account, amount}: mintOnyxTokenParams) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "mintOnyxToken",
		args: [BigInt(amount)],
		account: account as `0x${string}`,
	});
}

export async function redeemCollateral({
	account,
	collateralAddress,
	collateralAmount,
}: redeemCollateralParams) {
	return writeContract(config, {
		address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
		abi: ONYX_ENGINE_CONTRACT.abi,
		functionName: "redeemCollateral",
		args: [collateralAddress as `0x${string}`, BigInt(collateralAmount)],
		account: account as `0x${string}`,
	});
}

export const getAccountInformation = async ({userAddress}: getAccountInformationParams) => {
    const {data: userInfo, refetch} = useReadContracts({
        contracts: [
            {
                address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
                abi: ONYX_ENGINE_CONTRACT.abi,
                functionName: "getAccountInformation",
                args: [userAddress as `0x${string}`]
            },
            {
                address: ONYX_ENGINE_CONTRACT.address as `0x${string}`,
                abi: ONYX_ENGINE_CONTRACT.abi,
                functionName: "healthFactor",
                args: [userAddress as `0x${string}`]
            }
        ]
    })

    return {
        userInfo,
        refetch
    }
}

export default getAccountInformation