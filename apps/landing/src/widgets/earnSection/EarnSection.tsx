import EarnBackground from "@/../public/earn-background.jpg";
import getUserDevice from "@/shared/libs/device/utils/getUserDevice";
import LinkButton from "@/shared/ui/LinkButton";
import Image from "next/image";

const EarnSection = async () => {
	const { isDesktop, isMobile } = await getUserDevice()


	return (
		<section
			id="earn"
			className={`relative w-screen ${isDesktop ? "px-[3vw] h-screen" : "px-3 flex-col-reverse gap-y-5"} flex justify-between items-center`}
		>
			<div
				id="card"
				className={`h-full flex items-center justify-center ${isDesktop ? "w-1/2 p-5" : "w-full"}`}
			>
				<div
					className="rounded-2xl w-full max-w-[500px] h-[700px] relative"
				>
					<Image src={EarnBackground} alt="" fill className="object-cover rounded-2xl" />
					<div
						className={`w-full h-full backdrop-blur-xl text-center rounded-2xl p-10 text-white flex flex-col gap-y-5 justify-between items-center`}
					>
						<p className="font-medium text-xl">
							When positions become unsafe, they can be liquidated.
						</p>
						<div
							className={`flex w-full flex-col justify-evenly grow ${isMobile ? "text-center" : "px-10"}`}
						>
							<p
								className={`${isDesktop && "text-start"} text-2xl`}
							>
								As a liquidator, you:
							</p>
							<p
								className={`${isDesktop && "text-end"} text-2xl`}
							>
								Burn your tokens
							</p>
							<p
								className={`${isDesktop && "text-start"} text-2xl`}
							>
								Receive collateral at a discount
							</p>
							<p
								className={`${isDesktop && "text-end"} text-2xl`}
							>
								Help keep the system stable
							</p>
						</div>
						<p className="font-medium text-xl">
							The protocol rewards active participants.
						</p>
					</div>
				</div>
			</div>
			<div
				id="earn-title"
				className={`${isDesktop && "w-1/2 px-5"} pt-10 px-2 h-full flex flex-col text-center justify-center items-center gap-y-5`}
			>
				<h2 className="font-medium text-6xl">
					How can you earn?
				</h2>
				<p className="text-2xl">Become a liquidator</p>
				{isDesktop && <LinkButton id="earn-link-button" />}
				<p
					className={`text-xl ${isDesktop && "absolute right-[3vw] bottom-15"}`}
				>
					Help the System. Earn Rewards.
				</p>
			</div>
		</section>
	);
};

export default EarnSection;
