"use client";
import { useEffect } from "react";
import { GsapProviderProps } from "../types/types";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

export let scrollSmoother: ScrollSmoother | undefined;

const GsapProvider = ({
	children,
	isMobile,
}: GsapProviderProps) => {
	
	useEffect(() => {
		const wrapperElement = document.getElementById("wrapper") as HTMLDivElement;
		const contentElement = document.getElementById("content") as HTMLDivElement;

		if (
			typeof window === "undefined" ||
			isMobile || 
			!wrapperElement ||
			!contentElement
		) {
			return;
		}

		gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

		scrollSmoother = ScrollSmoother.create({
			wrapper: wrapperElement,
			content: contentElement,
			smooth: 1.2,
			effects: true,
		});

		gsap.fromTo(
			"#hero",
			{
				opacity: 1,
			},
			{
				opacity: 0,
				scrollTrigger: {
					trigger: "#start",
					start: "center top",
					end: "bottom top",
					scrub: true,
				},
			},
		);

		gsap.fromTo(
			"#hero-link-button",
			{ x: 0 },
			{
				x: 500,
				scrollTrigger: {
					trigger: "#start",
					start: "center center",
					end: "bottom top",
					scrub: true,
				},
			},
		);

		gsap.fromTo(
			"#about-link-button",
			{ x: 2000 },
			{
				x: 0,
				scrollTrigger: {
					trigger: "#about",
					start: "top bottom",
					end: "top center",
					scrub: true,
				},
			},
		);
		gsap.fromTo(
			"#about-link-button",
			{ x: 0 },
			{
				x: -1500,
				scrollTrigger: {
					trigger: "#about",
					start: "center center",
					end: "bottom top",
					scrub: true,
				},
			},
		);
		gsap.fromTo(
			"#about-title",
			{ x: -300, opacity: 0 },
			{
				x: 0,
				opacity: 1,
				scrollTrigger: {
					trigger: "#about",
					start: "top bottom",
					end: "center center",
					scrub: true,
				},
			},
		);
		gsap.fromTo(
			"#about-description",
			{ x: 300, opacity: 0 },
			{
				x: 0,
				opacity: 1,
				scrollTrigger: {
					trigger: "#about",
					start: "top bottom",
					end: "center center",
					scrub: true,
				},
			},
		);

		gsap.fromTo(
			["#block-1", "#block-2"],
			{ width: 0 },
			{
				width: "24%",
				scrollTrigger: {
					trigger: "#about",
					start: "top bottom",
					end: "bottom center",
					scrub: true,
				},
			},
		);
		gsap.fromTo(
			"#block-3",
			{ height: 0 },
			{
				height: "300px",
				scrollTrigger: {
					trigger: "#about",
					start: "top bottom",
					end: "center center",
					scrub: true,
				},
			},
		);
		gsap.fromTo(
			"#earn-link-button",
			{ y: -500, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				scrollTrigger: {
					trigger: "#earn",
					start: "top center",
					end: "center center",
					scrub: true,
				},
			},
		);

		gsap.fromTo(
			"#earn-link-button",
			{ y: 0, opacity: 1 },
			{
				y: 500,
				opacity: 0,
				scrollTrigger: {
					trigger: "#earn",
					start: "center center",
					end: "bottom top",
					scrub: true,
				},
			},
		);

		gsap.fromTo(
			"#earn-title",
			{ opacity: 0 },
			{
				opacity: 1,
				scrollTrigger: {
					trigger: "#earn",
					start: "top center",
					end: "center center",
				},
			},
		);

		const ctx = gsap.context(() => {
			gsap.from("#card", {
				opacity: 0,
				rotationY: 180,
				rotationX: 20,
				scale: 1.2,
				boxShadow: "0 30px 40px rgba(0,0,0,0.3)",
				scrollTrigger: {
					trigger: "#earn",
					start: "top center",
					end: "center center",
					scrub: true,
				},
			});
		});

		gsap.fromTo(
			"#faq-content",
			{ opacity: 0, x: -1000 },
			{
				x: 0,
				opacity: 1,
				scrollTrigger: {
					trigger: "#faq-title",
					start: "top bottom",
					end: "center center",
					scrub: true,
				},
			},
		);

		return () => ctx.revert();
	}, []);

	return children;
};

export default GsapProvider;
