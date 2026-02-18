import getUserDevice from "@/shared/libs/device/utils/getUserDevice";
import LinkButton from "@/shared/ui/LinkButton";

const EndSection = async () => {
	const {isMobile} = await getUserDevice()

	return (
		<section id="end" className="w-screen h-screen flex flex-col justify-between p-10">
			<div className="flex flex-col space-y-5 justify-center items-center text-center grow">
				<h2 className={`font-medium ${isMobile ? "text-xl leading-10" : "text-5xl leading-15"}`}>Take part in a stable and transparent system.</h2>
				<p className={`font-medium ${isMobile ? "text-xl" : "text-3xl"}`}>Ready to Try It?</p>
				<LinkButton id="end-link-button" />
			</div>
			<div className="flex items-center justify-evenly text-center gap-5 flex-wrap">
				<p>Mint stablecoins</p>
				<p>Monitor positions</p>
				<p>Earn as a liquidator</p>
			</div>
		</section>
	);
};

export default EndSection;
