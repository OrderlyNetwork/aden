"use client"

import { useState } from "react"
import { Link } from "@remix-run/react"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "../utils"
import SignInModal from "./SignInModal"
import { useTranslation } from "../i18n/TranslationContext"
import LanguageSwitcher from "./LanguageSwitcher"

// Navigation data structure with dropdown items
const navigationItems = [
  {
    title: "Guide",
    href: "/guide/guide1",
    dropdown: [
      {
        title: "BUGSCOIN DOC",
        href: "/products/featured",
      },
      {
        title: "What is ANTTALK?",
        href: "/guide/guide1",
      },
      {
        title: "Demo Trading Guide",
        href: "/guide/guide2",
      },
      {
        title: "Mining Guide",
        href: "/guide/guide3",
      },
      {
        title: "벅스코인 스왑방법",
        href: "/guide/guide4",
      }
    ],
  },
  {
    title: "Gate.io",
    href: "/gate.io",
    image: "/images/gateio.svg",
    dropdown: [],
  },
  {
    title: "HashKey",
    href: "/hashkey",
    dropdown: [],
  },
  {
    title: "USDT Futures",
    href: "/usdt-futures",
    dropdown: [
      {
        title: "Bitcoin",
        href: "/bitcoin",
      },
      {
        title: "Ethereum",
        href: "/ethereum",
      }
    ],
  },
  {
    title: "Crypto Data",
    href: "/crypto-data",
    image: "/images/chart.svg",
    color: "#18f2ad",
    dropdown: [],
  },
  {
    title: "Community",
    href: "/community",
    dropdown: [
      {
        title: "Best",
        href: "/best",
      },
      {
        title: "Free Board",
        href: "/free-board",
      },
      {
        title: "Analysis Board",
        href: "/analysis-board",
      },
      {
        title: "Notice",
        href: "/notice",
      },
      {
        title: "Help desk",
        href: "/help-desk",
      }
    ],
  },
  {
    title: "Ranking",
    href: "/ranking",
    dropdown: [
      {
        title: "Top 100",
        href: "/top-100",
      },
      {
        title: "Hall of Fame",
        href: "/hall-of-fame",
      },
    ],
  },
  {
    title: "Market",
    href: "/market",
    dropdown: [],
  }
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const { t } = useTranslation()

  const handleMouseEnter = (title: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setActiveDropdown(title)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setActiveDropdown(null)
    }, 300) // 300ms delay before hiding the dropdown
    setTimeoutId(id)
  }

  return (
    <header className="dc-w-full dc-min-w-1800 dc-h-68 dc-flex dc-items-center dc-justify-center dc-bg-[#212631] dc-backdrop-blur supports-[backdrop-filter]:dc-bg-background/60">
      <div className="dc-min-w-1784 dc-w-1784 dc-flex dc-items-center dc-justify-between dc-h-16">
        <div className="dc-mr-280 dc-flex">
          <Link to="/" className="dc-flex dc-items-center dc-space-x-2">
            {/* <span className="text-xl font-bold">Logo</span> */}
            <img src="/images/logo.svg" alt="logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="md:dc-flex dc-items-center dc-justify-between dc-flex-1 dc-hidden">
          <ul className="dc-flex dc-gap-20 dc-space-x-4">
            {navigationItems.map((item) => (
              <li
                key={item.title}
                className="group dc-relative"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.href}
                  className="hover:dc-bg-accent hover:dc-text-accent-foreground dc-flex dc-items-center dc-px-3 dc-py-2 dc-font-bold dc-rounded-sm"
                >
                  {item.image && <img src={item.image} alt={item.title} className={cn("dc-w-16 dc-h-16 dc-mr-4")} />}
                  {item.title}
                  {item.dropdown.length > 0 && (
                    <ChevronDown
                      className={cn("dc-w-16 dc-h-16 dc-ml-4 dc-transition-transform", activeDropdown === item.title ? "dc-rotate-180" : "")}
                    />
                  )}
                </Link>

                {/* Dropdown Menu */}
                <div
                  className={cn(
                    "dc-absolute dc-left-0 dc-mt-4 dc-z-[50] dc-w-196 dc-rounded-sm dc-bg-popover dc-bg-[#202632] dc-p-4 dc-shadow-md dc-transition-all dc-duration-200 dc-ease-in-out",
                    activeDropdown === item.title
                      ? "dc-opacity-100 dc-translate-y-0"
                      : "dc-opacity-0 dc-translate-y-4 dc-pointer-events-none",
                  )}
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="dc-grid dc-gap-4">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.title}
                        to={dropdownItem.href}
                        className="hover:dc-bg-accent dc-block dc-p-8 dc-rounded-sm"
                      >
                        <div className="dc-font-bold">{dropdownItem.title}</div>
                        {/* <div className="text-muted-foreground text-sm">{dropdownItem.description}</div> */}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="dc-flex dc-items-center dc-space-x-2">
            <div className="size-sm dc-w-120 dc-h-40 dc-mr-16">
              <LanguageSwitcher className="dc-h-full" />
            </div>
            <img src="/images/bell.svg" alt="bell" className="!dc-mr-16" />
            <button 
              className="size-sm dc-w-98 dc-h-40 dc-bg-[#18f2ad] dc-text-black dc-font-bold dc-rounded-sm"
              onClick={() => setIsSignInModalOpen(true)}
            >
              {t('auth.login')}
            </button>
            {/* <button className="size-sm w-98 h-40 bg-[#18f2ad] text-black font-bold rounded-sm">{t('auth.logout')}</button> */}
          </div>
        </nav>

        {/* Sign In Modal */}
        <SignInModal 
          isOpen={isSignInModalOpen} 
          onClose={() => setIsSignInModalOpen(false)} 
        />

        {/* Mobile Menu button */}
        <div className="md:dc-hidden dc-flex dc-items-center dc-justify-end dc-flex-1">
          <button
            className="size-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="dc-w-6 dc-h-6" /> : <Menu className="dc-w-6 dc-h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:dc-hidden">
          <div className="dc-px-4 dc-py-3 dc-space-y-1">
            {navigationItems.map((item) => (
              <div key={item.title} className="dc-py-2">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                  className="dc-flex dc-items-center dc-justify-between dc-w-full dc-py-2 dc-text-sm dc-font-medium dc-text-left dc-rounded-sm"
                >
                  {item.title}
                  {item.dropdown.length > 0 && (
                    <ChevronDown
                      className={cn("dc-w-16 dc-h-16 dc-transition-transform", activeDropdown === item.title ? "dc-rotate-180" : "")}
                    />
                  )}
                </button>

                {activeDropdown === item.title && (
                  <div className="dc-pl-4 dc-mt-2 dc-space-y-2">
                    {item.dropdown.map((dropdownItem) => (
                      <Link key={dropdownItem.title} to={dropdownItem.href} className="dc-block dc-py-2 dc-rounded-sm">
                        <div className="dc-font-medium">{dropdownItem.title}</div>
                        {/* <div className="text-muted-foreground text-sm">{dropdownItem.description}</div> */}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="dc-px-4 dc-py-3 dc-border-t">
            <div className="dc-flex dc-flex-col dc-space-y-2">
              <button className="dc-w-full">
                Log in
              </button>
              <button className="dc-w-full">Sign up</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

