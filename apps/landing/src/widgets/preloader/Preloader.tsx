"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Preloader = () => {
	const [isLoading, setLoading] = useState(true);
	const [progress, setProgress] = useState(0);
	const [switchColorIndex, setSwitchColorIndex] = useState(0);

	const fromColor = ["from-violet-700", "from-rose-500", "from-yellow-300"];
	const toColor = ["to-indigo-800", "to-pink-600", "to-lime-500"];
	const gradientVariant = ["bg-radial", "bg-linear-to-b", "bg-linear-to-r"];

	const loaderRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const swichColorInterval = setInterval(() => {
			setSwitchColorIndex((prev) => (prev + 1) % 3);
		}, 1500);

		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) return prev;
				return prev + 10;
			});
		}, 100);

		const handleLoad = () => {
			gsap.to(progressRef.current, {
				opacity: 0,
				y: -800,
				rotate: 90,
				duration: 0.5,
				scale: 0.7,
				ease: "sine.in",
			});
			gsap.to(loaderRef.current, {
				opacity: 0,
				duration: 1.5,
				ease: "power1.in",
			});

			setProgress(100);
			setTimeout(() => setLoading(false), 2000);
			clearInterval(progressInterval);
			clearInterval(swichColorInterval);
		};

		if (document.readyState === "complete") {
			handleLoad();
		} else {
			window.addEventListener("load", handleLoad);
		}
		return () => {
			window.removeEventListener("load", handleLoad);
			clearInterval(progressInterval);
			clearInterval(swichColorInterval);
		};
	}, []);

	if (!isLoading) return null;

	return (
		<div
			ref={loaderRef}
			className="fixed z-999 top-0 left-0 w-screen h-dvh flex items-center justify-center bg-black"
		>
			<div
				className="bg-white z-997 fixed top-0 left-0 transition-all duration-150"
				style={{ width: "100%", height: `${progress}%` }}
			></div>
			<div
				className={`h-[95%] w-[95%] z-998 rounded-4xl flex flex-col items-center justify-center ${gradientVariant[switchColorIndex]} ${fromColor[switchColorIndex]} ${toColor[switchColorIndex]} transition-colors duration-50`}
			>
				<div
					ref={progressRef}
					className="relative w-[300px] h-[300px] bg-black rounded-4xl"
				>
					<div
						className={`absolute left-[12%] top-[12%] z-10 w-[230px] h-[230px] flex justify-center items-center gap-x-3 rounded-3xl  ${gradientVariant[switchColorIndex]} ${fromColor[switchColorIndex]} ${toColor[switchColorIndex]}`}
					>
						<div className="h-5 w-5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
						<div className="h-5 w-5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
						<div className="h-5 w-5 animate-bounce rounded-full bg-white"></div>
					</div>
					<div
						className="bg-white rounded-3xl transition-all duration-150"
						style={{ width: "100%", height: `${progress}%` }}
					></div>
				</div>
				<p className="fixed bottom-10 left-[49%] text-white">
					{progress}%
				</p>
			</div>
		</div>
	);
};

export default Preloader;
