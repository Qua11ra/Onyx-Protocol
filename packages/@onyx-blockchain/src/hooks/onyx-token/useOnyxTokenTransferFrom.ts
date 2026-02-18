import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { transferFrom } from "../../actions/onyxToken.actions";

export default function useOnyxTokenTransferFrom() {
    const mutation = useMutation({
        mutationFn: transferFrom
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        transferFrom: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}