import Image from "next/image";
import OnyxLogo from "@/../public/logo/Onyx-logo.jpg"

const Logo = () => {
	return (
		<div
			className="flex items-center gap-x-5 pl-2 pr-3 py-1 transition-all duration-300 rounded-xl backdrop-blur-xl"
		>
			<Image priority src={OnyxLogo} alt="onyx-logo" className="w-15 h-15 rounded-2xl" />
			<h2 className="text-(--text-primary) font-medium text-2xl pt-1">Onyx</h2>
		</div>
	);
};

export default Logo;
