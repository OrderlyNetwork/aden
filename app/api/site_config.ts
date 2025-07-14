import api from "../utils/api";

type SiteConfig = {
    success: boolean;
    data: {
        _id: {
            $oid: string;
        },
        site_name: string;
        logo_url: string;
        favicon_url: string;
        company_name: string;
        business_reg_no: string;
        address: string;
        contact_phone: string;
        contact_email: string;
        twitter_url: string;
        facebook_url: string;
        instagram_url: string;
        telegram_url: string;
        created_at: {
            $date: {
                $numberLong: string;
            };
        };
        updated_at: string;
    };
};

export const getSiteConfig = async () => {
    const response = await api.get("/api/site-config");
    return response.data as SiteConfig;
};

