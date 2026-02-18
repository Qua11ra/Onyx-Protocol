import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { burnOnyxToken } from "../../actions/onyxEngine.actions";

export default function useBurnOnyxToken() {
    const mutation = useMutation({
        mutationFn: burnOnyxToken
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        burnOnyxToken: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}