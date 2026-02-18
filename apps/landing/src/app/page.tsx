import EarnSection from "@/widgets/earnSection/EarnSection";
import EndSection from "@/widgets/end-section/EndSection";
import FaqSection from "@/widgets/faq-section/FaqSection";
import HeroSection from "@/widgets/hero-section/HeroSection";
import AboutSection from "@/widgets/about-section/AboutSection";
import Footer from "@/widgets/footer/Footer";
import getUserDevice from "@/shared/libs/device/utils/getUserDevice";

const App = async () => {
	const {isMobile, isDesktop} = await getUserDevice()
	return (
		<>
			<main
			id="wrapper"
				className={`w-full h-fit`}
			>
				<div id="content">
					<HeroSection />
					<AboutSection />
					<EarnSection />
					<FaqSection isDesktop={isDesktop} isMobile={isMobile}/>
					<EndSection />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default App;
