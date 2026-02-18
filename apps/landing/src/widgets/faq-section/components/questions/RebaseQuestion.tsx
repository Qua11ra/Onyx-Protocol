import FaqBackground from "@/../public/faq-background.jpg";
import Image from "next/image";
import { FaqSectionProps } from "../../types/types";

const RebaseQuestion = ({isMobile}: FaqSectionProps) => {
	return (
		<div
			className="h-full max-w-[500px] rounded-3xl relative bg-(--text-primary) text-(--bg-primary)"
		>
			<Image src={FaqBackground} alt="" fill className="object-left rounded-2xl" />
			<div className="w-full h-full backdrop-blur-2xl rounded-3xl p-10 flex flex-col gap-y-5 justify-evenly text-white items-center text-center">
				<h2 className={`font-medium ${isMobile ? "text-xl" : "text-5xl"} mb-5`}>
					This is a rebase token.
				</h2>

				<p className={isMobile ? "text-sm" : "text-xl"}>
					Your number of tokens may change over time. But your share of the system stays the same.
				</p>

				<p className={isMobile ? "text-sm" : "text-xl"}>
					You don’t lose your position. You keep your proportional ownership.
				</p>

				<p className={isMobile ? "text-sm" : "text-xl"}>
					This keeps the system flexible and stable at the same time.
				</p>
			</div>
		</div>
	);
};

export default RebaseQuestion;
