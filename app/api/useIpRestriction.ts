import { useEffect, useState } from "react";

function formatRegion(region: string): string {
    return region?.replace(/\s+/g, "").toLowerCase();
}

export const useIpRestriction = () => {
    const [isRestricted, setIsRestricted] = useState<boolean>(false);
    const [ipInfo, setIpInfo] = useState<{ ip: string; region: string } | null>(null);

    useEffect(() => {
        fetch("https://api.orderly.org/v1/ip_info")
            .then((res) => res.json())
            .then((data) => {
                const userRegion = data?.data?.region || "";
                const userIp = data?.data?.ip || "";
                setIpInfo({ ip: userIp, region: userRegion });
                // Get restricted regions from env
                const envRegions = import.meta.env.VITE_CUSTOM_RESTRICTED_REGIONS || "";
                const restrictedRegions = envRegions.split(",").map((r: string) => formatRegion(r));
                // Get whitelisted IPs from env
                const envWhitelistIps = import.meta.env.VITE_CUSTOM_WHITELISTED_IPS || "";
                const whitelistIps = envWhitelistIps.split(",").map((ip: string) => ip.trim()).filter((ip: string) => ip.length > 0);
                // If IP is whitelisted, do not restrict
                if (whitelistIps.includes(userIp)) {
                    setIsRestricted(false);
                    return;
                }
                if (restrictedRegions.includes(formatRegion(userRegion))) {
                    setIsRestricted(true);
                }
            });
    }, []);

    return { isRestricted, ipInfo };
};
