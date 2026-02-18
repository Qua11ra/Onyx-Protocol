import FaqBackground from "@/../public/faq-background.jpg";
import Image from "next/image";
import { FaqSectionProps } from "../../types/types";

const OvercollateralQuestion = ({isMobile}: FaqSectionProps) => {
	return (
		<div
			className="h-full max-w-[500px] rounded-3xl relative bg-(--text-primary)"
		>
			<Image src={FaqBackground} alt="" fill className="object-center rounded-2xl" />
			<div className="w-full h-full backdrop-blur-2xl rounded-3xl p-10 flex flex-col gap-y-5 justify-evenly text-white items-center text-center">
				<h2 className={`font-medium ${isMobile ? "text-xl" : "text-3xl"} mb-10`}>
					Overcollateralized for Safety
				</h2>
				<p className={isMobile ? "text-sm" : "text-xl"}>
					Every token is backed by twice its value in collateral.
				</p>
				<p className={isMobile ? "text-sm" : "text-xl"}>
					This creates a safety buffer during market volatility.
				</p>
				<p className={isMobile ? "text-sm" : "text-xl"}>
					The protocol doesn’t rely on trust. It relies on math.
				</p>
			</div>
		</div>
	);
};

export default OvercollateralQuestion;
