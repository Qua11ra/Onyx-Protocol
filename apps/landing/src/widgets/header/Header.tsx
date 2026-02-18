import ThemeButton from "@/shared/libs/switchTheme/components/SwitchThemeButton";
import Navigation from "./components/Navigation";
import { lazy } from "react";
import getUserDevice from "@/shared/libs/device/utils/getUserDevice";

const LazyLogo = lazy(() => import('./components/Logo'))

const Header = async () => {
	const { isDesktop } = await getUserDevice()

	return (
		<header
			className={`fixed left-0 top-0 z-990 w-screen h-[5vh] py-12 px-[3vw] flex items-center justify-between text-(--text-primary)`}
		>
			<LazyLogo />
			{isDesktop && <Navigation />}
			<div className="flex gap-x-5">
				<ThemeButton />
				{/* TODO add <SwitchLanguageButton />  */}
			</div>
		</header>
	);
};

export default Header;
