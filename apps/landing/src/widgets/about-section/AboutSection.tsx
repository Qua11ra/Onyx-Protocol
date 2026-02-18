import LinkButton from "@/shared/ui/LinkButton";
import AboutBackground from "@/../public/about-background.jpg";
import Image from "next/image";
import getUserDevice from "@/shared/libs/device/utils/getUserDevice";

const AboutSection = async () => {
	const { isMobile } = await getUserDevice()

	return (
		<section
			id="about"
			data-speed="1.5"
			className={`w-screen py-15 ${isMobile ? "px-3" : "px-15"}`}
		>
			<div className="w-full h-full rounded-4xl flex flex-col pt-5 justify-between items-center space-y-5">
				<div
					className={`w-full flex justify-center ${isMobile ? "flex-col gap-y-5" : "gap-x-15"}`}
				>
					<div
						className={`flex flex-col gap-y-10 ${isMobile ? "w-full text-center" : "w-1/2 text-right"}`}
					>
						<div
							id="about-title"
							className="flex flex-col font-medium gap-y-5"
						>
							<h2 className="text-5xl">
								What is Onyx Protocol?
							</h2>
							<p className="text-2xl">
								A Simple and Transparent Rebase Stablecoin System
							</p>
						</div>
					</div>
					<div
						id="about-description"
						className={`text-xl flex flex-col gap-y-5 ${isMobile ? "w-full text-center" : "w-1/2"}`}
					>
						<p className="text-xl">
							This protocol allows anyone to mint tokens by locking collateral worth 200% of the token value.
						</p>
						<p className="text-xl">
							Every token in circulation is backed by more value than it represents.
						</p>
					</div>
				</div>
				<LinkButton id="about-link-button" />
				<div
					className={`w-full flex justify-evenly gap-y-5 ${isMobile ? "flex-col p-2" : "flex-wrap"}`}
				>
					<div
						id="block-1"
						className={`${isMobile ? "w-full space-y-3" : "min-w-[200px] w-[24%] h-[300px]"} p-7 bg-indigo-950 rounded-3xl overflow-hidden flex flex-col justify-between`}
					>
						<p className="text-white font-medium text-2xl">
							No banks.
						</p>
						<p className="text-white">
							Lock collateral worth 200% Mint new tokens instantly Use them anywhere like a stablecoin.
						</p>
					</div>
					<div
						id="block-2"
						className={`${isMobile ? "w-full space-y-3" : "min-w-[200px] w-[24%] h-[300px]"} p-7 overflow-hidden bg-indigo-950 rounded-3xl flex flex-col justify-between`}
					>
						<p className="text-white font-medium text-2xl">
							No hidden risks.
						</p>
						<p className="text-white">
							Each position has a health score. If collateral value drops too low, the position becomes unsafe.
						</p>
					</div>
					<div
						id="block-3"
						className={`flex ${isMobile ? "w-full" : "h-[300px] w-1/2"} rounded-3xl overflow-hidden relative`}
					>
						<Image src={AboutBackground} alt="" fill className="object-cover" />
						<div className="backdrop-blur-xl w-full h-full rounded-3xl p-7 flex flex-col justify-between">
							<p className="text-white font-medium text-2xl">
								Just smart contracts and clear rules.
							</p>
							<p className="text-white font-medium text-2xl self-end">
								Designed for Stability
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default AboutSection;
