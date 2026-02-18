import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { redeemCollateralAndBurnOnyxTokens } from "../../actions/onyxEngine.actions";

export default function useRedeemAndBurn() {
    const mutation = useMutation({
        mutationFn: redeemCollateralAndBurnOnyxTokens
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        redeemAndBurn: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}