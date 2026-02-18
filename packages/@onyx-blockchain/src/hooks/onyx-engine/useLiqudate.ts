import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { liquidate } from "../../actions/onyxEngine.actions";

export default function useLiquidate() {
    const mutation = useMutation({
        mutationFn: liquidate
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        liquidate: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}