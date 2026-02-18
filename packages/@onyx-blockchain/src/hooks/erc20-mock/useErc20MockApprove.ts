import { useMutation } from "wagmi/query";
import { approve } from "../../actions/erc20Mock.actions";
import { useWaitForTransactionReceipt } from "wagmi";

export default function useErc20MockApprove() {
    const mutation = useMutation({
        mutationFn: approve
    })

    const receipt = useWaitForTransactionReceipt({hash: mutation.data})

    return {
        approve: mutation.mutate,
        hash: mutation.data,
        isSending: mutation.isPending,
        isConfirming: receipt.isPending,
        isConfirmed: receipt.isSuccess,
        isError: mutation.isError || receipt.isError
    }
}