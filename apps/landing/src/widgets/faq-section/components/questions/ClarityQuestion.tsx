import FaqBackground from "@/../public/faq-background.jpg";
import Image from "next/image";
import { FaqSectionProps } from "../../types/types";

const ClarityQuestion = ({isMobile}: FaqSectionProps) => {
	return (
		<div
			className="h-full max-w-[500px] rounded-3xl relative bg-(--text-primary)"
		>
			<Image src={FaqBackground} alt="" fill className="object-right rounded-2xl" />
			<div className={`w-full h-full backdrop-blur-2xl rounded-3xl ${isMobile ? "p-5" : "p-10"} flex flex-col gap-y-5 justify-evenly text-white items-center text-center`}>
				<h2 className={`font-medium ${isMobile ? "text-xl" : "text-5xl"} mb-5`} >Built for Clarity</h2>

				<p className={`${isMobile ? "text-sm" : "text-xl"} leading-10`}>
					Transparent smart contracts Fully on-chain logic Clear collateral rules No centralized control
				</p>

				<p className={`${isMobile ? "text-sm" : "text-xl"} leading-10`}>
					Everything happens automatically. Everything is verifiable.
				</p>
			</div>
		</div>
	);
};

export default ClarityQuestion;
