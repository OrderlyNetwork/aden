import React from 'react';
import { Link, useLocation } from "@remix-run/react";
import LanguageSwitcher from '~/components/LanguageSwitcher';
import { useTranslation } from "~/i18n/TranslationContext";
import { ChevronDownIcon, ChevronUp, ChevronDown, Maximize2, Minimize2, Menu, X } from 'lucide-react';
import useCommonStore from '~/store/commonStore';
import { useState, useRef, useEffect } from 'react';
import UserDropdownMenu from '~/components/UserDropdownMenu';
import UserLoginPrompt from '~/components/UserLoginPrompt';
import { useUserStore } from '~/store/userStore';
import useModalStore from '~/store/modalStore';
import { isAuthenticated, isUserLoggedIn } from '~/api/auth';
import capitalize from '~/utils/capitalize';
import { getBoard } from '@/api/board';
import Alert from '@/components/Alert';

interface MainLayoutProps {
  children: React.ReactNode;
}


// Navigation data structure with dropdown items
const navigationItems = [
  {
    titleKey: "nav.trading",
    href: "/",
    image: "",
    dropdown: []
  },
  {
    titleKey: "nav.portfolio",
    href: "/portfolio",
    image: "",
    dropdown: []
  },
  {
    titleKey: "nav.markets",
    href: "/markets",
    image: "",
    dropdown: []
  },
  {
    titleKey: "nav.leaderboard",
    href: "/leaderboard",
    image: "",
    dropdown: []
  },
  {
    titleKey: "nav.futures",
    href: "/demo_trading/BTCUSDT",
    image: "/v2/images/candlestick.png",
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
]



const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { selectedBoardName, isNavCollapsed, setIsNavCollapsed } = useCommonStore();
  const { user } = useUserStore();
  const { setIsOpenSignInModal, setIsOpenSignUpModal } = useModalStore();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [activeBoards, setActiveBoards] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isGuidePage = location.pathname.includes('/guide');
  // const isDemoTradingPage = location.pathname.includes('/demo_trading');
  const isDemoTradingPage = false;
  const isRankingPage = location.pathname.includes('/ranking');
  const isHallOfFamePage = location.pathname.includes('/hall_of_fame');
  const isMarketPage = location.pathname.includes('/market');
  const activeTab = location.pathname.split('/').pop() || '';

  const dynamicNavigationItems = navigationItems.map(item => {
    if (item.titleKey === "nav.community") {
      return {
        ...item,
        dropdown: [...activeBoards].reverse().map(board => ({
          titleKey: `community.${board.name}`,
          href: `/board/${board.name}`,
          name: board.name,
          ko_name: board.ko_name,
          en_name: board.name,
        }))
      }
    }
    return item;
  });

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 윈도우 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // useEffect(() => {
  //   const fetchBoards = async () => {
  //     try {
  //       const response = await getBoard();
  //       if (response.success) {
  //         // is_active가 true인 게시판만 필터링
  //         setActiveBoards(response.data.filter((b: any) => b.is_active));
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   fetchBoards();
  // }, []);

  // 로그인 상태 확인
  useEffect(() => {
    if (mounted) {
      console.log('Mounted:', isAuthenticated(), user);
      // if (user && user.user_id !== -1) {
      if (isAuthenticated() && user && user.user_id !== -1) {
        setIsLoggedIn(true);
      } else {
        const authStatus = isAuthenticated();
        setIsLoggedIn(authStatus && isUserLoggedIn(user));
      }
    }
  }, [user, mounted]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleDropdown = () => {
    // setIsDropdownOpen(!isDropdownOpen);
    setIsAlertOpen(true)
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSignInClick = () => {
    setIsOpenSignInModal(true);
  };

  const handleSignUpClick = () => {
    setIsOpenSignUpModal(true);
  };

  // FullMode 토글 (header 줄이기/원상태)
  const toggleFullMode = () => {
    setIsHeaderCollapsed(!isHeaderCollapsed);
  };

  // iPad 해상도 체크 (768px - 1024px)
  const isIpadResolution = windowWidth >= 768 && windowWidth < 1024;

  // Desktop 해상도 체크 (1024px 이상)
  const isDesktopResolution = windowWidth >= 1024;

  // Set header collapsed by default for demo_trading pages on Desktop resolution
  // useEffect(() => {
  //   if (isDemoTradingPage && isDesktopResolution && windowWidth > 0) {
  //     setIsHeaderCollapsed(true);
  //   } else {
  //     setIsHeaderCollapsed(false);
  //   }
  // }, [isDemoTradingPage, isDesktopResolution, windowWidth]);

  // 게시판 이름 매핑
  // 네비게이션 활성 상태 체크 함수
  const isNavItemActive = (item: any) => {
    switch (item.titleKey) {
      case 'nav.guide':
        return location.pathname.includes('/guide');
      case 'nav.cryptoData':
        return location.pathname.includes('/analysis') || location.pathname.includes('/news');
      case 'nav.community':
        return location.pathname.includes('/board');
      case 'nav.ranking':
        return location.pathname.includes('/ranking') || location.pathname.includes('/hall_of_fame');
      case 'nav.futures':
        return location.pathname.includes('/demo_trading');
      case 'nav.market':
        return location.pathname.includes('/market');
      default:
        return location.pathname === item.href;
    }
  };

  const getBoardTitle = () => {
    if (isGuidePage) return t('nav.guide');
    if (isRankingPage || isHallOfFamePage) return t('nav.ranking');
    if (isMarketPage) return t('nav.market');
    if (location.pathname.includes('/board/') && selectedBoardName) {
      return capitalize(selectedBoardName);
    }
    return '';
  };

  // 사용자 프로필 섹션 렌더링
  const renderUserProfile = () => (
    <div className='dc-relative' ref={dropdownRef}>
      <div
        className={`dc-flex dc-items-center dc-bg-gradient-to-br dc-from-[#1C1E21] dc-to-[#111316] dc-border dc-border-[#1F2126] dc-rounded-[40px] dc-cursor-pointer hover:dc-border-[#C7AD88] dc-transition-all dc-duration-300 ${isHeaderCollapsed
          ? 'dc-min-w-140 dc-w-140 dc-h-32 dc-p-6 dc-gap-6'
          : 'dc-min-w-180 dc-w-180 dc-h-32 dc-p-6 dc-gap-6'
          }`}
        onClick={toggleDropdown}
      >
        <img
          src={isLoggedIn && user?.profile_image_url ? user.profile_image_url : "/v2/images/random_profile.png"}
          alt="user"
          className={`dc-object-cover dc-rounded-full dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-w-20 dc-h-20' : 'dc-w-20 dc-h-20'
            }`}
        />
        <div className={`dc-flex dc-items-center dc-transition-all dc-duration-300 ${isHeaderCollapsed
          ? 'dc-w-[calc(100%-44px)] dc-gap-1'
          : 'dc-w-[calc(100%-44px)] dc-gap-12'
          }`}>
          <span className={`dc-text-white dc-transition-all dc-duration-300 dc-truncate ${isHeaderCollapsed ? 'dc-text-10' : 'oui-text-sm'
            }`}>
            {isLoggedIn && user?.username ? user.username : t('userInfo.guest')}
          </span>
          <div className='dc-flex dc-items-center dc-gap-6'>
            <span className={`dc-text-[#C7AD88] dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-text-8' : 'dc-text-12'
              }`}>
              {t('userInfo.level')}
            </span>
            <img
              src={`/v2/images/level/LV_${isLoggedIn && user?.level ? user.level : 1}.webp`}
              alt="level"
              className={`dc-transition-all translate-y-[-2px] dc-duration-300 ${isHeaderCollapsed ? 'dc-w-8 dc-h-8' : 'dc-w-16 dc-h-16'
                }`}
            />
          </div>
        </div>
        <ChevronDownIcon
          className={`dc-cursor-pointer dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-w-8 dc-h-8' : 'dc-w-8 dc-h-8'
            } ${isDropdownOpen ? 'dc-rotate-180' : ''}`}
          stroke="#C7AD88"
        />
      </div>
      {/* 로그인 상태에 따라 다른 모달 표시 */}
      {isLoggedIn ? (
        <UserDropdownMenu
          isOpen={isDropdownOpen}
          onClose={handleCloseDropdown}
        />
      ) : (
        <UserLoginPrompt
          isOpen={isDropdownOpen}
          onClose={handleCloseDropdown}
          onSignInClick={handleSignInClick}
          onSignUpClick={handleSignUpClick}
        />
      )}
    </div>
  );

  return (
    <div className="dc-hidden md:dc-flex md:dc-min-w-1920 dc-min-h-screen dc-bg-[#111318]">
      {/* <Nav isHeaderCollapsed={isDemoTradingPage && (isIpadResolution || isDesktopResolution) ? isHeaderCollapsed : false} /> */}
      <div className={`dc-min-w-1920 dc-w-full dc-h-full dc-flex dc-flex-col dc-transition-all dc-duration-300 dc-ease-in-out`}>
        {isDemoTradingPage ? (
          <header className={`dc-pr-[11.625px] dc-w-full dc-flex dc-items-center dc-justify-between dc-bg-[#111318] dc-border-b dc-border-[#1F2126] dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'oui-py-1 dc-h-48 dc-pl-[11.625px]' : 'dc-h-48 dc-pl-[11.625px]'
            }`}>
            <div className="dc-min-w-700 dc-flex dc-items-center oui-gap-3">
              <Link to="/" >
                <img src='/v2/logo.svg' alt="logo" className='dc-min-w-[129.5px] cursor-pointer' />
              </Link>
              <Link to="/demo_trading/BTCUSDT" className={`dc-font-pre-semibold dc-font-bold dc-flex dc-items-center dc-transition-all dc-duration-300 ${isHeaderCollapsed
                ? 'dc-h-24 dc-text-18'
                : 'dc-h-24 dc-text-18'
                } ${activeTab === "BTCUSDT" ? "dc-text-white" : "dc-text-white/20"}`}>
                BTCUSDT
              </Link>
              <span className={`dc-border-r dc-border-[#1F2126] dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-w-1 dc-h-16' : 'dc-w-1 dc-h-24'
                }`} />
              <Link to="/demo_trading/ETHUSDT" className={`dc-font-pre-semibold dc-font-bold dc-flex dc-items-center dc-transition-all dc-duration-300 ${isHeaderCollapsed
                ? 'dc-h-24 dc-text-18'
                : 'dc-h-24 dc-text-18'
                } ${activeTab === "ETHUSDT" ? "dc-text-white" : "dc-text-white/20"}`}>
                ETHUSDT
              </Link>
            </div>
            <div className="dc-flex dc-items-center oui-gap-3">
              <LanguageSwitcher compact={isHeaderCollapsed} />
              <span className={`dc-border-r dc-border-[#1F2126] dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-w-1 dc-h-16' : 'dc-w-1 dc-h-24'
                }`} />
              <div className={`dc-flex dc-items-center dc-gap-4 dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-w-160' : 'dc-w-230'
                }`}>
                <img src="/v2/images/alert.png" alt="user" className={`dc-transition-all dc-duration-300 ${isHeaderCollapsed ? 'dc-w-20 dc-h-20' : 'dc-w-32 dc-h-32'}`} />
                {renderUserProfile()}
              </div>
            </div>
          </header>
        ) : (
          <header className="dc-px-[11.625px] dc-w-full dc-h-48 dc-flex dc-items-center dc-justify-between dc-bg-[#111318] dc-border-b dc-border-[#1F2126]">
            <div className="dc-min-w-700 dc-h-full dc-flex dc-items-center oui-gap-3">
              <Link to="/">
                <img src='/v2/logo.svg' alt="logo" className='dc-min-w-[129.5px] cursor-pointer' />
              </Link>
              <div className="dc-flex dc-items-center oui-gap-1">
                {dynamicNavigationItems.map((item, index) => (
                  <div
                    key={index}
                    className="dc-relative dc-group"
                  >
                    <Link
                      to={item.href}
                      className={`oui-px-3 mt-[0.725px] dc-relative dc-group dc-h-32 dc-rounded oui-px-3 dc-flex dc-items-center dc-gap-2 oui-text-sm dc-font-semibold  hover:dc-bg-[#2A2D32]/25 dc-duration-300 oui-py-1 ${isNavItemActive(item) ? 'oui-text-transparent oui-bg-clip-text oui-gradient-brand oui-whitespace-nowrap oui-break-normal' : 'dc-text-white'
                        }`}
                      style={{
                        // @ts-ignore
                        '--oui-gradient-angle': '45deg',
                      }}
                    >
                      <div className='relative text-white inline-flex'>
                        <span className={isNavItemActive(item) ? 'oui-text-transparent oui-bg-clip-text oui-gradient-brand oui-whitespace-nowrap oui-break-normal' : 'dc-text-white'}>{t(item.titleKey)}</span>
                        {isNavItemActive(item) && (
                          <div className="oui-box oui-rounded-full oui-gradient-brand oui-absolute oui-position oui-size-width oui-size-height -oui-translate-x-1/2" style={{ "--oui-gradient-angle": "45deg", "--oui-width": "90%", "--oui-height": "3px", "--oui-left": "50%", "--oui-bottom": "-6px" }}></div>
                        )}
                      </div>
                      {item.dropdown.length > 0 && (
                        <ChevronDown
                          className="dc-w-16 dc-h-16 dc-text-white hover:oui-text-transparent hover:oui-bg-clip-text hover:oui-gradient-brand dc-transition-all dc-duration-300 group-hover:dc-rotate-180"
                        />
                      )}
                    </Link>
                    {item.dropdown.length > 0 && (
                      <div
                        className="dc-absolute dc-top-full dc-left-0 dc-bg-[#1F2126] dc-border dc-border-[#2A2D32] dc-rounded-lg dc-shadow-lg dc-transition-all dc-duration-300 dc-min-w-180 dc-z-50 dc-opacity-0 dc-invisible dc-translate-y-[-10px] group-hover:dc-opacity-100 group-hover:dc-visible group-hover:dc-translate-y-0"
                      >
                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                          <Link
                            key={dropdownIndex}
                            to={dropdownItem.href}
                            className="dc-block dc-px-16 oui-py-1 oui-text-sm dc-text-white hover:dc-bg-[#2A2D32] dc-transition-colors dc-duration-200 dc-first:dc-rounded-t-lg dc-last:dc-rounded-b-lg dc-border-b dc-border-[#2A2D32] dc-last:dc-border-b-0"
                          >
                            {t.language === 'ko' ? dropdownItem.ko_name : dropdownItem.en_name || dropdownItem.titleKey ? t(dropdownItem.titleKey) : dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="dc-flex dc-items-center oui-gap-3">
              <LanguageSwitcher />
              <span className='dc-w-1 dc-h-24 dc-border-r dc-border-[#1F2126]' />
              <div className='dc-w-230 dc-flex dc-items-center dc-gap-8'>
                <img src="/v2/images/alert.png" alt="user" className='dc-w-32 dc-h-32' />
                {renderUserProfile()}
              </div>
            </div>
          </header>
        )}
        <div className={`dc-flex dc-w-full dc-gap-24 ${isDemoTradingPage
          ? `${isHeaderCollapsed ? 'dc-h-[calc(100vh-48px)]' : 'dc-h-[calc(100vh-48px)]'} oui-py-1 dc-px-24`
          : 'dc-h-[calc(100vh-48px)] dc-p-24'
          }`}>
          <main className={`dc-flex-1 dc-bg-[#111318] dc-text-white dc-overflow-y-auto dc-relative dc-transition-all dc-duration-300 dc-ease-in-out ${isDemoTradingPage
            ? (isNavCollapsed ? 'dc-w-[calc(100vw-448px)]' : 'dc-w-[calc(100vw-672px)]')
            : 'dc-w-[calc(100vw-672px)]'
            }`}>
            {children}
          </main>
        </div>
      </div>
      <Alert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={"DEX 모의투자 8월 31일 오픈 예정"}
      />
    </div>
  );
};

export default MainLayout; 