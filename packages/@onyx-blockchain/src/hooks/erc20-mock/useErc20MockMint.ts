import { useMutation } from "wagmi/query";
import { mint } from "../../actions/erc20Mock.actions";
import { useWaitForTransactionReceipt } from "wagmi";

export default function useErc20MockMint() {
    const mutation = useMutation({
        mutationFn: mint
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        mint: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}