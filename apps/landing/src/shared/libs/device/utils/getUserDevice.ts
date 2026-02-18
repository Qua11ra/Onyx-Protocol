'use server'
import { headers } from "next/headers";
import { cache } from "react";

const getUserDevice = cache(async() => {
    const headersList = await headers()

    const userAgent = headersList.get('user-agent') || ''

    const isMobile =  /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent) || 
                   (isMobile && /(?:android)(?!.*mobile)/i.test(userAgent));
    const isDesktop = !isMobile && !isTablet
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    const viewPort = {
        width: isMobile ? 375 : isTablet ? 768 : 1020,
        height: isMobile ? 667 : isTablet ? 1024 : 1000
    }

    return {
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        viewPort
    }
})
export default getUserDevice