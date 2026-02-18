import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { mintOnyxToken } from "../../actions/onyxEngine.actions";

export default function useMintOnyxToken() {
    const mutation = useMutation({
        mutationFn: mintOnyxToken
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        mintOnyxToken: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}