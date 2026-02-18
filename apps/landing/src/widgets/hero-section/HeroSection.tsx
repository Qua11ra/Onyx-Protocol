import background from "@/../public/background.jpg";
import getUserDevice from "@/shared/libs/device/utils/getUserDevice";
import LinkButton from "@/shared/ui/LinkButton";
import Image from "next/image";

const HeroSection = async () => {
	const { isDesktop, isMobile } = await getUserDevice()
	return (
		<section
			id="start"
			className={`w-screen h-screen ${isDesktop && "p-10 pt-25"}`}
		>
			<div
				id="hero"
				className={`w-full h-full ${isDesktop && "rounded-4xl"} overflow-hidden`}
			>
				<div className="w-full h-full relative pt-20">
				<Image src={background.src} alt="" fill className="object-cover" />
					<div className="w-full h-full backdrop-blur-sm flex flex-col justify-between pb-5 items-center">
						<div
							className={`flex flex-col gap-y-3 text-white font-medium items-center text-center ${isMobile && "grow justify-between pb-10"}`}
						>
							<h2 className="text-3xl px-3">
								A Stable Token Backed by 200% Collateral.
							</h2>
							<div className="flex flex-col justify-center items-center text-xl px-3">
								<p>Mint tokens by locking collateral</p>
								<p>Use them like a stablecoin</p>
								<p>Earn by keeping the system healthy</p>
							</div>
						</div>
						<div
							className={`w-full flex ${isMobile ? "flex-col items-center" : "pl-10 pr-20 justify-between items-center"}`}
						>
							<h1
								className={`text-white font-medium ${isMobile ? "" : "text-[8vw]"}`}
							>
								Onyx Protocol.
							</h1>
							<LinkButton id="hero-link-button" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
