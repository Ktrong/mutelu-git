"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const ref = searchParams.get("ref");
        if (ref) {
            // Save the referral code to localStorage
            localStorage.setItem("affiliateCode", ref);

            // Optionally set an expiry date if you want codes to expire
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 30); // 30 days validity
            localStorage.setItem("affiliateCodeExpiry", expiry.getTime().toString());
        } else {
            // Check if existing code has expired
            const expiry = localStorage.getItem("affiliateCodeExpiry");
            if (expiry && new Date().getTime() > parseInt(expiry)) {
                localStorage.removeItem("affiliateCode");
                localStorage.removeItem("affiliateCodeExpiry");
            }
        }
    }, [searchParams]);

    return null; // This component doesn't render anything
}
