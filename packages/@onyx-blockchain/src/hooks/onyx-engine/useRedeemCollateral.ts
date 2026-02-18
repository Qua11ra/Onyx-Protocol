import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { redeemCollateral } from "../../actions/onyxEngine.actions";

export default function useRedeemCollateral() {
    const mutation = useMutation({
        mutationFn: redeemCollateral
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        redeemCollateral: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}