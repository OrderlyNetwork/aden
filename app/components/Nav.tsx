"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "@remix-run/react"
import { Menu, X, ChevronDown, Bell, LogOut, ChevronRight, LogIn, ChevronDownIcon } from "lucide-react"
import { cn } from "../utils"
import useModalStore from "../store/modalStore"
import { isAuthenticated, logout } from "~/api/auth"
import useUserStore from "../store/userStore"
import { getCookie, setCookie, removeCookie } from "../utils/cookies"
import { useUserAssetsStore } from "../store/userAssetsStore"
import NumberAnimation from "../components/NumberAnimation"
import React from "react"
import { useTranslation } from "../i18n/TranslationContext"
import LanguageSwitcher from "./LanguageSwitcher"
import { getSiteConfig } from "../api/site_config"
import { getBoard } from "../api/board"
import MobileLanguageSwitcher from "./MobileLanguageSwitcher"
import useCommonStore from "../store/commonStore"
import UserLoginPrompt from "./UserLoginPrompt"

// Navigation data structure with dropdown items
const navigationItems = [
  {
    titleKey: "nav.home",
    href: "/",
    image: "/images/home.png",
    dropdown: [],
  },
  {
    titleKey: "nav.bugscoinDoc",
    href: "https://www.bugscoin.com",
    target: "_blank",
    image: "/images/doc.png",
    dropdown: [],
  },
  {
    titleKey: "nav.guide",
    href: "/",
    image: "/images/guide.png",
    dropdown: [
      {
        titleKey: "guide.whatIsAnttalk",
        href: "/guide/guide1",
      },
      {
        titleKey: "guide.demoTradingGuide",
        href: "/guide/guide2",
      },
      {
        titleKey: "guide.miningGuide",
        href: "/guide/guide3",
      },
      {
        titleKey: "guide.swapGuide",
        href: "/guide/guide4",
      }
    ],
  },
  {
    titleKey: "nav.gateio",
    href: "https://www.gate.io/",
    target: "_blank",
    dropdown: [],
  },
  {
    titleKey: "nav.futures",
    href: "/",
    image: "/images/candlestick.png",
    dropdown: [
      {
        titleKey: "crypto.bitcoin",
        href: "/demo_trading/BTCUSDT",
      },
      {
        titleKey: "crypto.ethereum",
        href: "/demo_trading/ETHUSDT",
      },
    ],
  },
  {
    titleKey: "nav.cryptoData",
    href: "/",
    image: "/images/equalizer.png",
    dropdown: [
      {
        titleKey: "data.analyze",
        href: "/analysis",
      },
      {
        titleKey: "data.news",
        href: "/news",
      }
    ],
  },
  {
    titleKey: "nav.community",
    href: "/",
    image: "/images/forum.png",
    dropdown: [
      {
        titleKey: "community.best",
        href: "/board/best",
      },
      {
        titleKey: "community.freeBoard",
        href: "/board/free",
      },
      {
        titleKey: "community.analysisBoard",
        href: "/board/analysis",
      },
      {
        titleKey: "community.notice",
        href: "/board/notice",
      },
      {
        titleKey: "community.helpDesk",
        href: "/board/help_desk",
      }
    ],
  },
  {
    titleKey: "nav.ranking",
    href: "/ranking",
    image: "/images/trophy.png",
    dropdown: [
      {
        titleKey: "ranking.top100",
        href: "/ranking",
      },
      {
        titleKey: "ranking.hallOfFame",
        href: "/hall_of_fame",
      },
    ],
  },
  {
    titleKey: "nav.market",
    href: "/market",
    image: "/images/store.png",
    dropdown: [],
  }
]

// Helper function to safely access cookies
const safeCookieStorage = {
  getItem: (key: string): string | null => {
    try {
      return getCookie(key);
    } catch (error) {
      console.error('Error accessing cookies:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      setCookie(key, value);
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      removeCookie(key);
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }
};

interface NavProps {
  isHeaderCollapsed?: boolean;
}

export default React.memo(function Nav({ isHeaderCollapsed = false }: NavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsOpenSignInModal, setIsOpenSignUpModal } = useModalStore();
  const { user, resetUser } = useUserStore();
  const { userAssets } = useUserAssetsStore();
  const { t, language } = useTranslation();
  const { isNavCollapsed, setIsNavCollapsed } = useCommonStore();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [activeBoards, setActiveBoards] = useState<any[]>([]);

  // Check if current page is demo trading
  const isDemoTrading = location.pathname.startsWith('/demo_trading');

  useEffect(() => {
    setMounted(true);
    // Check initial auth state
    setIsLoggedIn(isAuthenticated());

    // Load nav collapsed state from localStorage
    const collapsed = localStorage.getItem('nav-collapsed') === 'true';
    setIsNavCollapsed(collapsed);

    // 사이트 설정 데이터 가져오기
    const fetchSiteConfig = async () => {
      try {
        const response = await getSiteConfig();
        if (response.success) {
          setSiteConfig(response.data);
        }
      } catch (error) {
        console.error("Error fetching site config:", error);
      }
    };

    fetchSiteConfig();
  }, [setIsNavCollapsed]);

  // Check auth state whenever user changes
  useEffect(() => {
    if (user && user.user_id !== -1) {
      // If we have user data, we're definitely logged in
      setIsLoggedIn(true);
    } else {
      // Check if we have an auth token but no user data yet
      const authStatus = isAuthenticated();
      // Only set logged out if we don't have a token and no user data
      if (!authStatus) {
        setIsLoggedIn(false);
      }
    }
  }, [user]);

  // Check auth token on component mount and refresh
  useEffect(() => {
    if (mounted) {
      // Always check auth token on mount
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
    }
  }, [mounted]);

  // Load dropdown state from cookies on component mount
  useEffect(() => {
    if (mounted) {
      const savedDropdown = safeCookieStorage.getItem('anttalk-nav-dropdown');
      if (savedDropdown) {
        setOpenDropdown(savedDropdown);
      }
    }
  }, [mounted]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getBoard();
        if (response.success) {
          // is_active가 true인 게시판만 필터링
          setActiveBoards(response.data.filter((b: any) => b.is_active));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBoards();
  }, []);

  const handleClickMyPage = () => {
    navigate("/my_information/info");
    setMobileMenuOpen(false);
  }

  const handleClickSignInModal = () => {
    setIsOpenSignInModal(true);
  }

  const handleClickSignUpModal = () => {
    setIsOpenSignUpModal(true);
  }

  const handleClickSignOut = () => {
    logout();
    setIsLoggedIn(false);
    resetUser();
    window.location.href = "/";
  }

  // Save dropdown state to cookies whenever it changes
  const toggleDropdown = (title: string) => {
    if (openDropdown === title) {
      setOpenDropdown(null);
      if (mounted) {
        safeCookieStorage.removeItem('anttalk-nav-dropdown');
      }
    } else {
      setOpenDropdown(title);
      if (mounted) {
        safeCookieStorage.setItem('anttalk-nav-dropdown', title);
      }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNav = () => {
    const newCollapsed = !isNavCollapsed;
    setIsNavCollapsed(newCollapsed);
    localStorage.setItem('nav-collapsed', newCollapsed.toString());
  };

  // Helper function to check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  // Helper function to handle navigation link clicks
  const handleNavClick = (href: string) => {
    // Close navigation if clicking a demo trading link
    if (href.includes('/demo_trading')) {
      setIsNavCollapsed(true);
      localStorage.setItem('nav-collapsed', 'true');
    }
  };

  // Helper function to handle mobile navigation link clicks
  const handleMobileNavClick = (href: string) => {
    // Always close mobile menu
    toggleMobileMenu();
    // Close navigation if clicking a demo trading link
    if (href.includes('/demo_trading')) {
      setIsNavCollapsed(true);
      localStorage.setItem('nav-collapsed', 'true');
    }
  };

  const renderUserProfile = () => (
    <div className="dc-w-full dc-h-80 dc-flex dc-px-12 dc-py-16 dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[12px] dc-mb-8 dc-relative dc-overflow-hidden">
      <div className="dc-absolute dc-top-[-26px] dc-left-0 dc-w-52 dc-h-52 dc-rounded-full dc-bg-[#40B185] dc-blur-2xl"></div>
      <img
        src={isLoggedIn && user?.profile_image_url ? user.profile_image_url : "/images/random_profile.png"}
        alt="user"
        className='dc-object-cover dc-w-40 dc-h-40 dc-mr-10 dc-rounded-full'
      />
      <div className='dc-w-[calc(100%-80px)] dc-flex dc-flex-col dc-gap-4'>
        <span className='dc-text-14 dc-text-white'>
          {isLoggedIn && user?.username ? user.username : "Guest"}
        </span>
        <div className='dc-flex dc-items-center dc-gap-4'>
          <img
            src={`/images/level/LV_${isLoggedIn && user?.level ? user.level : 1}.webp`}
            alt="level"
            className='dc-w-16 dc-h-16'
          />
          <span className='dc-text-12 dc-text-[#C7AD88]'>
            Level {isLoggedIn && user?.level ? user.level : 1}
          </span>
        </div>
      </div>
    </div>
  );

  // SNS 링크 확인 함수
  const renderSocialLinks = (containerClass: string) => {
    if (!siteConfig) return null;

    const socialLinks = [
      { url: siteConfig.twitter_url, name: "Twitter", bg: "#1DA1F2", icon: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' fill='white'/%3E%3C/svg%3E" },
      { url: siteConfig.facebook_url, name: "Facebook", bg: "#4267B2", icon: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20.9 2H3.1C2.5 2 2 2.5 2 3.1v17.8c0 .6.5 1.1 1.1 1.1h9.6v-7.8h-2.6v-3h2.6V9.2c0-2.6 1.6-4 3.9-4 1.1 0 2.1.1 2.3.1v2.7h-1.6c-1.3 0-1.5.6-1.5 1.5v1.9h3l-.4 3h-2.6V22h5.1c.6 0 1.1-.5 1.1-1.1V3.1c0-.6-.5-1.1-1.1-1.1z' fill='white'/%3E%3C/svg%3E" },
      { url: siteConfig.instagram_url, name: "Instagram", bg: "#C13584", icon: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' fill='white'/%3E%3C/svg%3E" },
      { url: siteConfig.telegram_url, name: "Telegram", bg: "#0088cc", icon: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.16-.04-.23-.02-.1.02-1.62 1.03-4.58 3.03-.43.3-.82.44-1.17.43-.39-.01-1.13-.22-1.68-.4-.68-.23-1.22-.35-1.17-.74.02-.2.3-.4.81-.6 3.15-1.37 5.26-2.27 6.33-2.71 3.02-1.24 3.64-1.45 4.05-1.46.1 0 .32.02.46.19.12.14.15.33.17.47-.03.06-.03.12-.05.31z' fill='white'/%3E%3C/svg%3E" }
    ];

    // URL이 있는 항목만 필터링
    const filteredLinks = socialLinks.filter(link => link.url && link.url.trim() !== '');

    if (filteredLinks.length === 0) return null;

    return (
      <div className={containerClass}>
        {filteredLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="dc-flex dc-items-center dc-text-white"
          >
            <div className={`dc-w-32 dc-h-32 dc-bg-[${link.bg}] dc-rounded-sm dc-flex dc-items-center dc-justify-center`}>
              <img
                src={link.icon}
                alt={link.name}
                className="dc-w-20 dc-h-20"
              />
            </div>
          </a>
        ))}
      </div>
    );
  };

  const dynamicNavigationItems = navigationItems.map(item => {
    if (item.titleKey === "nav.community") {
      return {
        ...item,
        dropdown: [...activeBoards].reverse().map(board => ({
          titleKey: `community.${board.name}`,
          href: `/board/${board.name}`,
          name: board.name,
          ko_name: board.ko_name,
        }))
      }
    }
    return item;
  });

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:dc-flex dc-flex md:dc-hidden dc-fixed dc-items-center dc-h-[37.39px] dc-top-0 dc-left-0 dc-right-0 dc-z-100 dc-items-center dc-justify-between dc-bg-[#111318] dc-border-b dc-border-[#1F2126] dc-px-[9.625px] dc-pt-[2px]">
        {/* Logo */}
        <Link to="/" className="dc-h-[25.5px]">
          <img
            src="/logo.svg"
            alt="ADEN"
            className="dc-w-auto dc-h-[25.5px]"
          />
        </Link>

        {/* Hamburger Menu Button */}
        <div className="dc-flex dc-items-center">
          {!mobileMenuOpen && <MobileLanguageSwitcher />}
          {/* {mobileMenuOpen && isLoggedIn && (
            <div className="dc-w-132 dc-h-28 dc-flex dc-items-center dc-bg-gradient-to-r dc-from-[#1C1E21] dc-to-[#111316] dc-bg-opacity-80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[26px]">
              <button type="button" className="dc-text-11 dc-flex dc-items-center dc-justify-center dc-flex-1" onClick={handleClickMyPage}>MYPAGE</button>
              <span className="dc-bg-opacity-6 dc-block dc-w-1 dc-h-16 dc-bg-white dc-rounded-sm" />
              <button type="button" className="dc-text-11 dc-flex dc-items-center dc-justify-center dc-flex-1" onClick={handleClickSignOut}>LOGOUT</button>
            </div>
          )}

          {mobileMenuOpen && !isLoggedIn && (
            <div className="dc-w-58 dc-h-28 dc-flex dc-items-center dc-bg-gradient-to-r dc-from-[#1C1E21] dc-to-[#111316] dc-bg-opacity-80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[26px]">
              <button type="button" className="dc-text-11 dc-flex dc-items-center dc-justify-center dc-flex-1" onClick={handleClickSignInModal}>LOGIN</button>
            </div>
          )}
          
          <span className="dc-bg-opacity-6 dc-ml-14 dc-block dc-w-1 dc-h-16 dc-mr-6 dc-bg-white dc-rounded-sm" />
          <button 
            onClick={toggleMobileMenu}
            className="focus:dc-outline-none dc-text-white"
          >
            {mobileMenuOpen ? <button className="dc-w-36 dc-h-36 dc-flex dc-items-center dc-justify-center"><X size={20}/></button> : <img src="/images/hamberger.png" alt="menu" className="dc-w-36 dc-h-36" />}
          </button> */}
        </div>
      </div>

      {/* Mobile Menu Overlay - Half width */}
      {mobileMenuOpen && (
        <>
          {/* Half-width menu on the left side */}
          <div className={cn(
            "md:dc-hidden dc-fixed dc-top-0 dc-left-0 dc-z-50 dc-w-full dc-h-full dc-min-h-screen dc-bg-[#111318] dc-pt-80 dc-px-16 dc-overflow-y-auto dc-shadow-lg dc-transition-transform dc-duration-300 dc-ease-in-out",
            mobileMenuOpen ? "dc-translate-x-0" : "dc--translate-x-full"
          )}>
            <div className="dc-flex dc-flex-col dc-min-h-full">
              {renderUserProfile()}
              <div className="dc-w-full dc-h-80 dc-flex dc-px-12 dc-py-16 dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[12px] dc-mb-8 dc-relative dc-overflow-hidden">
                <div className="dc-absolute dc-top-[-26px] dc-left-0 dc-w-52 dc-h-52 dc-rounded-full dc-bg-[#40B185] dc-blur-2xl"></div>
                <div className='dc-flex dc-flex-col dc-justify-center dc-w-1/2 dc-gap-8'>
                  <div className='dc-flex dc-items-center dc-w-full'>
                    <img src="/images/USDT.png" alt="USDT" className="dc-w-20 dc-h-20 dc-mr-4" />
                    <span className="dc-text-14 dc-font-medium dc-text-[#898D99]">{t('userInfo.usdt')}</span>
                  </div>
                  <span className="dc-text-14 dc-font-bold">
                    <NumberAnimation
                      value={userAssets.usdt_balance}
                      decimals={4}
                    />
                  </span>
                </div>
                <div className='dc-flex dc-flex-col dc-justify-center dc-w-1/2 dc-gap-8'>
                  <div className='dc-flex dc-items-center dc-w-full'>
                    <img src="/images/bugs.png" alt="BUGS" className="dc-w-20 dc-h-20 dc-mr-4" />
                    <span className="dc-text-14 dc-font-medium dc-text-[#898D99]">{t('userInfo.bugs')}</span>
                  </div>
                  <span className="dc-text-14 dc-font-bold">
                    <NumberAnimation
                      value={userAssets.bugs_balance}
                      decimals={4}
                    />
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="dc-pb-100 dc-flex-1">
                {dynamicNavigationItems.map((item) => (
                  <div key={item.titleKey} className="dc-mb-24">
                    <div
                      className="dc-text-16 dc-flex dc-items-center dc-font-medium dc-text-white dc-cursor-pointer hover:dc-bg-[#16181D] dc-px-8 dc-py-6 dc-rounded-sm"
                      onClick={() => item.dropdown.length > 0 && toggleDropdown(t(item.titleKey))}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={t(item.titleKey)}
                          className="dc-w-24 dc-h-24 dc-mr-8"
                        />
                      )}
                      {item.dropdown.length === 0 && (
                        <Link
                          to={item.href}
                          target={item.target}
                          className={cn(
                            "text-16 flex-1"
                          )}
                        >
                          <span>{t(item.titleKey)}</span>
                        </Link>
                      )}
                      {item.dropdown.length > 0 && (
                        <span className="dc-text-16 dc-flex-1">
                          {item.titleKey === 'nav.community'
                            ? t(item.titleKey)
                            : t(item.titleKey)}
                        </span>
                      )}
                      {item.dropdown.length > 0 && (
                        <ChevronDown
                          size={16}
                          color="#777777"
                          className={cn(
                            "dc-transition-transform",
                            openDropdown === t(item.titleKey) ? "dc-rotate-180" : ""
                          )}
                        />
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {item.dropdown.length > 0 && openDropdown === t(item.titleKey) && (
                      <div className="dc-py-8">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.titleKey}
                            to={dropdownItem.href}
                            className={cn(
                              "dc-block dc-px-10 dc-py-8 dc-text-13 dc-font-medium dc-text-[#777777] hover:dc-text-white hover:dc-bg-[#16181D]",
                              isActiveLink(dropdownItem.href) && "dc-text-[#E1E1E1]"
                            )}
                            onClick={() => handleMobileNavClick(dropdownItem.href)}
                          >
                            {item.titleKey === 'nav.community' && 'ko_name' in dropdownItem && language === 'KO' && dropdownItem.ko_name
                              ? dropdownItem.ko_name
                              : item.titleKey === 'nav.community' && 'name' in dropdownItem && language === 'EN' && dropdownItem.name
                                ? dropdownItem.name.charAt(0).toUpperCase() + dropdownItem.name.slice(1)
                                : t(dropdownItem.titleKey)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 소셜 링크 - 모바일 */}
              {renderSocialLinks("dc-flex dc-flex-col dc-justify-between dc-gap-20 dc-mb-12")}
            </div>
          </div>
        </>
      )}

      {/* Desktop Nav Background Overlay - Only show when nav is open on demo trading pages */}
      {isDemoTrading && !isNavCollapsed && (
        <div
          className="md:dc-block dc-bg-black/50 dc-fixed dc-inset-0 dc-z-30 dc-hidden"
          onClick={toggleNav}
        ></div>
      )}

      {/* Nav Toggle Button - Only show when nav is collapsed on demo trading pages and header is not collapsed */}
      {/* {isDemoTrading && isNavCollapsed && !isHeaderCollapsed && (
        <button
          onClick={toggleNav}
          className="md:flex top-24 left-20 fixed z-50 items-center justify-center hidden w-48 h-48 text-white"
        >
          <img src="/images/demotraindg_hamberger.png" alt="menu" className="dc-w-36 dc-h-36" />
        </button>
      )} */}

      {/* X Button - Outside Nav, only show when nav is open on demo trading pages */}
      {isDemoTrading && !isNavCollapsed && (
        <button
          onClick={toggleNav}
          className="dc-hidden md:dc-flex dc-fixed dc-top-20 dc-left-[290px] dc-z-50 dc-w-48 dc-h-48 dc-text-white dc-items-center dc-justify-center"
        >
          <X size={24} />
        </button>
      )}

      {/* Desktop navigation */}
      <nav className={cn(
        "dc-hidden md:dc-block dc-h-full dc-bg-[#111318] dc-border-r dc-border-[#1F2126] dc-sticky dc-top-0 dc-overflow-y-scroll dc-transition-all dc-duration-300 dc-ease-in-out",
        // 데모 트레이딩 페이지에서만 토글 상태 적용, 다른 페이지에서는 항상 열림
        isDemoTrading
          ? (isNavCollapsed ? "dc-p-0 dc-w-0 dc-opacity-0 dc-pointer-events-none" : "dc-w-270 dc-opacity-100 dc-py-32 dc-px-20")
          : "dc-w-270 dc-opacity-100 dc-py-32 dc-px-20",
        isDemoTrading && !isNavCollapsed ? "dc-z-40" : "dc-z-10"
      )} style={{ height: '100svh' }}>
        <div className="dc-relative">
          {/* Logo */}
          <Link to="/" className="dc-mb-42 dc-block dc-w-full">
            <img
              src="/logo.svg"
              alt="ADEN"
              className="dc-mb-42 dc-h-auto dc-w-130"
            />
          </Link>

          {/* Navigation Items */}
          <div className="dc-flex-1">
            {dynamicNavigationItems.map((item) => (
              <div key={item.titleKey} className="dc-mb-24">
                <div
                  className="dc-text-16 dc-flex dc-items-center dc-font-medium dc-text-white dc-cursor-pointer hover:dc-bg-[#16181D] dc-px-8 dc-py-6 dc-rounded-sm"
                  onClick={() => item.dropdown.length > 0 && toggleDropdown(t(item.titleKey))}
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={t(item.titleKey)}
                      className="dc-w-24 dc-h-24 dc-mr-8"
                    />
                  )}
                  {item.dropdown.length === 0 && (
                    <Link
                      to={item.href}
                      target={item.target}
                      className={cn(
                        "text-16 flex-1"
                      )}
                    >
                      <span>{t(item.titleKey)}</span>
                    </Link>
                  )}
                  {item.dropdown.length > 0 && (
                    <span className="dc-text-16 dc-flex-1">
                      {item.titleKey === 'nav.community'
                        ? t(item.titleKey)
                        : t(item.titleKey)}
                    </span>
                  )}
                  {item.dropdown.length > 0 && (
                    <ChevronDown
                      size={16}
                      color="#777777"
                      className={cn(
                        "dc-transition-transform",
                        openDropdown === t(item.titleKey) ? "dc-rotate-180" : ""
                      )}
                    />
                  )}
                </div>

                {/* Dropdown Menu */}
                {item.dropdown.length > 0 && openDropdown === t(item.titleKey) && (
                  <div className="dc-py-8">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.titleKey}
                        to={dropdownItem.href}
                        className={cn(
                          "dc-block dc-px-10 dc-py-8 dc-text-13 dc-font-medium dc-text-[#777777] hover:dc-text-white hover:dc-bg-[#16181D]",
                          isActiveLink(dropdownItem.href) && "dc-text-[#E1E1E1]"
                        )}
                        onClick={() => handleNavClick(dropdownItem.href)}
                      >
                        {item.titleKey === 'nav.community' && 'ko_name' in dropdownItem && language === 'KO' && dropdownItem.ko_name
                          ? dropdownItem.ko_name
                          : item.titleKey === 'nav.community' && 'name' in dropdownItem && language === 'EN' && dropdownItem.name
                            ? dropdownItem.name.charAt(0).toUpperCase() + dropdownItem.name.slice(1)
                            : t(dropdownItem.titleKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 소셜 링크 - 데스크톱 */}
          {renderSocialLinks("dc-flex dc-flex-col dc-justify-between dc-gap-20 dc-mb-12")}
        </div>
      </nav>
    </>
  )
})

