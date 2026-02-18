import { useMutation } from "wagmi/query";
import { useWaitForTransactionReceipt } from "wagmi";
import { depositeAndMint } from "../../actions/onyxEngine.actions";

export default function useDepositeAndMint() {
    const mutation = useMutation({
        mutationFn: depositeAndMint
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        depositeAndMint: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}