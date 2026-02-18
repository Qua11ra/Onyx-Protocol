'use client';
import Link from "next/link";
import { scrollSmoother } from "@/shared/libs/animations/components/GsapProvider";

const Navigation = () => {

	const sectionsList = [
		{ link: "#start", text: "Start" },
		{ link: "#about", text: "About" },
		{ link: "#earn", text: "Earn" },
		{ link: "#faq", text: "Faq" },
		{ link: "#end", text: "End" },
	];

	function handleGo(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, to: string) {
		e.preventDefault()
		const target = to.replace("#", "")

		const targetElement = document.getElementById(target)

		if (!targetElement) return

		if (scrollSmoother) {
			scrollSmoother.scrollTo(targetElement, true)
		} else {
			targetElement.scrollIntoView({behavior: "smooth"})
		}
	}

	return (
		<nav>
			<ul className="pt-1 flex grow items-center justify-center space-x-10 list-none rounded-2xl">
				{sectionsList.map((section) => (
					<li
						key={section.link}
						className="hover:bg-(--nav-hover-bg) hover:text-(--nav-hover-text) text-(--text-primary) rounded-xl transition-colors duration-300"
					>
						<Link href={section.link}>
							<button className="px-3 py-2 cursor-pointer" onClick={(e) => handleGo(e, section.link)}>
								<p>{section.text}</p>
							</button>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Navigation;
