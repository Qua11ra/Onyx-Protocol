'use client'
import { useCallback, useEffect, useState } from "react";

const Footer = () => {
	const [progress, setProgress] = useState(0);
    const [lastCall, setLastCall] = useState(0);

    const handleScroll = useCallback(() => {
        if (Date.now() - lastCall < 3000) return;
            setLastCall(Date.now());
            
			const documentHeight =
				document.documentElement.scrollHeight - window.innerHeight;

			const currentScroll = window.scrollY;

			const scrollProgress = (currentScroll / documentHeight) * 100;

			setProgress(scrollProgress);
    }, [])

	useEffect(() => {
		if (typeof window === "undefined") return;

		handleScroll(); 
		window.addEventListener("scroll", handleScroll);

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener('click', handleScroll);
		});

		return () => {
            window.removeEventListener("scroll", handleScroll);
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.removeEventListener('click', handleScroll);
            });
        };
	}, []);
	return <div className="fixed left-0 bottom-0 h-[5px] w-full">
        <div className='h-full bg-(--scroll-primary)' style={{width: `${progress}%`}}></div>
    </div>;
};

export default Footer;
