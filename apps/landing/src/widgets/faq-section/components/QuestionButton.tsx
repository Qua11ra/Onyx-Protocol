import { useCallback } from "react";
import { QuestionButtonProps } from "../types/types";

const QuestionButton = ({
	selectedQuestion,
	questionToSelect,
	handleSelect,
	children,
}: QuestionButtonProps) => {
	
	const handleClick = useCallback(() => {
		const q = questionToSelect === selectedQuestion ? null : questionToSelect
		handleSelect(q)
	}, [selectedQuestion, questionToSelect, handleSelect])

	return (
		<button
			onClick={handleClick}
			className={`${selectedQuestion === questionToSelect && "border-green-400"} border-2 p-5 text-left rounded-xl cursor-pointer flex justify-between items-center transition-all duration-300`}
		>
			{children}
		</button>
	);
};

export default QuestionButton;
