import type { Metadata } from "next";
import Header from "@/widgets/header/Header";
import "./globals.css";
import Preloader from "@/widgets/preloader/Preloader";
import { cookies } from "next/headers";
import GsapProvider from "@/shared/libs/animations/components/GsapProvider";
import getUserDevice from "@/shared/libs/device/utils/getUserDevice";

export const metadata: Metadata = {
	title: "Onyx Protocol - Rebase Stablecoin Defi Protocol",
	description:
		"Dive into the world of stablecoins. Lock collateral to secure the protocol, use the Onyx stablecoin anywhere, and earn by participating in the protocol.",
	keywords: [
		"Onyx",
		"Protocol",
		"Defi",
		"Stablecoin",
		"Rebase",
		"Token",
		"Health",
		"Factor",
		"Liqudation",
		"Earn",
	],
	authors: {
		name: "Vladislav Perelygin",
	},
	icons: {
		icon: [
			{
				url: "/logo/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
			},
			{
				url: "/logo/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				url: "/logo/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				url: "/logo/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		apple: "/logo/apple-touch-icon.png",
		shortcut: "/logo/favicon.ico",
	},
	robots: {
		follow: true,
		index: true,
	},
	openGraph: {
		title: "Onyx Protocol - Rebase Stablecoin Defi Protocol",
		description:
			"Dive into the world of stablecoins. Lock collateral to secure the protocol, use the Onyx stablecoin anywhere, and earn by participating in the protocol.",
		url: "http://localhost:3006",
		siteName: "Onyx Protocol - Rebase Stablecoin Defi Protocol",
		images: {
			url: "/logo/favicon.ico",
			width: 500,
			height: 500,
			alt: "Onyx",
		},
		locale: "en_US",
		type: "website",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const theme = cookieStore.get("theme")?.value || "light";

	const { isMobile } = await getUserDevice();

	return (
		<html lang="en" data-theme={theme}>
			<body className="w-screen overflow-x-hidden">
				<Preloader />
				<Header />
				<GsapProvider isMobile={isMobile}>{children}</GsapProvider>
			</body>
		</html>
	);
}
