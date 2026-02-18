import {ONYX_HELPER_CONTRACT} from "../../contracts/tools-contracts";
import {useReadContract} from "wagmi";

export default async function getConfig() {
	return useReadContract({
		address: ONYX_HELPER_CONTRACT.address as `0x${string}`,
		abi: ONYX_HELPER_CONTRACT.abi,
		functionName: "getConfig",
	});
}