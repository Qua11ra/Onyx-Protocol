import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { transfer } from "../../actions/onyxToken.actions";

export default function useOnyxTokenTransfer() {
    const mutation = useMutation({
        mutationFn: transfer
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        transfer: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}