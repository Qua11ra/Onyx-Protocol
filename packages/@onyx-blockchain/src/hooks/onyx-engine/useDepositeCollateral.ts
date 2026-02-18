import { useMutation } from "wagmi/query";
import { depositCollateral } from "../../actions/onyxEngine.actions";
import { useWaitForTransactionReceipt } from "wagmi";

export default function useDepositeCollateral() {
    const mutation = useMutation({
        mutationFn: depositCollateral
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        depositCollateral: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}