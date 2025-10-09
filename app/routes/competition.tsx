import { useEffect, useState } from "react";
import { type MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Scaffold } from "@orderly.network/ui-scaffold";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import { useTranslation } from "@orderly.network/i18n";
import CampaignLeaderboard from "@/components/CampaignLeaderboard";

export const meta: MetaFunction = () => {
  return [
    { title: "ADEN Trading Competition" },
    { name: "description", content: "ADEN x Orderly Trading Competition - $500,000 USDT Prize Pool" },
  ];
};

function CompetitionContent() {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [countdownTitle, setCountdownTitle] = useState(t('extend.competition.countdownEnds'));

  useEffect(() => {
    function updateCountdown() {
      //KST 2025/10/15 18:00
      // in Timestamp is in milliseconds for 2025-10-15 18:00 KST (UTC+9)
      const targetDate = new Date(1760518800000);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({
          days: days.toString().padStart(2, '0'),
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        });
        setCountdownTitle(t('extend.competition.countdownStarts'));
      } else {
        setCountdownTitle(t('extend.competition.countdownActive'));
        setCountdown({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
      }
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [t]);

  useEffect(() => {
    // Handle video loading
    const video = document.querySelector('.hero-video-bg') as HTMLVideoElement;
    if (video) {
      video.addEventListener('error', function () {
        video.style.display = 'none';
      });

      video.play().catch(function (error) {
        console.log('Video autoplay failed:', error);
        video.style.display = 'none';
      });
    }

    // Add animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '0';
          target.style.transform = 'translateY(20px)';

          setTimeout(() => {
            target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            target.style.opacity = '1';
            target.style.transform = 'translateY(0)';
          }, 100);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.info-box, .prize-tier, .rule-item').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #111111;
            --bg-card: #161616;
            --bg-card-hover: #1a1a1a;
            --accent-primary: rgb(253, 180, 29);
            --accent-secondary: #ff0066;
            --accent-gold: rgb(253, 180, 29);
            --text-primary: #ffffff;
            --text-secondary: #888888;
            --text-muted: #555555;
            --border-color: #222222;
            --border-accent: #333333;
            --gradient-primary: linear-gradient(17.44deg, rgb(253, 180, 29) 0%, rgb(255, 140, 0) 100%);
            --gradient-secondary: linear-gradient(135deg, #ff0066 0%, #cc0052 100%);
            --gradient-gold: linear-gradient(17.44deg, rgb(253, 180, 29) 0%, rgb(255, 140, 0) 100%);
            --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.5);
            --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.6);
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.7);
            --glow-primary: 0 0 10px rgba(253, 180, 29, 0.3);
            --glow-secondary: 0 0 10px rgba(255, 0, 102, 0.3);
        }

        .competition-page {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .main-container {
            width: 100%;
            min-height: 100vh;
        }

        .content-wrapper {
            max-width: 1440px;
            margin: 0 auto;
            padding: 0 40px;
        }

        /* Hero Section */
        .hero-section {
            position: relative;
            min-height: 100vh;
            background: url('./back.webp') center/contain no-repeat;
            background-color: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 40px 0;
        }

        .hero-video-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
            min-width: 100%;
            min-height: 100%;
            background-color: var(--bg-primary);
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .hero-video-bg {
                width: auto;
                height: auto;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .hero-bg-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 50%, rgba(253, 180, 29, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, rgba(255, 0, 102, 0.05) 0%, transparent 50%),
                rgba(10, 10, 10, 0.56);
            z-index: 1;
        }

        .floating-logos {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 1;
        }

        .logo-float {
            position: absolute;
            opacity: 0.3;
            animation: float-diagonal 20s infinite ease-in-out;
        }

        .logo-float:nth-child(1) {
            width: 250px;
            top: 5%;
            left: -250px;
            animation-delay: 0s;
        }

        .logo-float:nth-child(2) {
            width: 200px;
            top: 40%;
            right: -200px;
            animation: float-diagonal-reverse 25s infinite ease-in-out;
            animation-delay: 3s;
        }

        .logo-float:nth-child(3) {
            width: 220px;
            bottom: 10%;
            left: -220px;
            animation-delay: 6s;
            animation-duration: 30s;
        }

        @keyframes float-diagonal {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(0.8);
            }
            25% {
                transform: translate(calc(30vw + 100px), -100px) rotate(90deg) scale(1);
            }
            50% {
                transform: translate(calc(100vw + 300px), -50px) rotate(180deg) scale(1.1);
            }
            75% {
                transform: translate(calc(70vw + 200px), 100px) rotate(270deg) scale(0.9);
            }
            100% {
                transform: translate(0, 0) rotate(360deg) scale(0.8);
            }
        }

        @keyframes float-diagonal-reverse {
            0% {
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
            25% {
                transform: translate(calc(-40vw - 100px), 80px) rotate(-90deg) scale(1.1);
            }
            50% {
                transform: translate(calc(-100vw - 300px), 30px) rotate(-180deg) scale(0.9);
            }
            75% {
                transform: translate(calc(-60vw - 150px), -60px) rotate(-270deg) scale(1);
            }
            100% {
                transform: translate(0, 0) rotate(-360deg) scale(1);
            }
        }

        .hero-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            opacity: 0.01;
            z-index: 1;
            animation: pulse-rotate 15s infinite ease-in-out;
        }

        @keyframes pulse-rotate {
            0%, 100% {
                opacity: 0.01;
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            50% {
                opacity: 0.02;
                transform: translate(-50%, -50%) scale(1.1) rotate(180deg);
            }
        }

        .hero-bg-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.3;
            z-index: 0;
        }

        .hero-video-bg {
            pointer-events: none;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }

        @media (prefers-reduced-motion: reduce) {
            .hero-video-bg {
                display: none !important;
            }
            
            .logo-float {
                animation: none !important;
            }
        }

        .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 40px 20px;
        }

        .hero-title {
            font-size: 88px;
            font-weight: 900;
            line-height: 110%;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: -3px;
            color: #fff;
            text-shadow: 
                0 2px 4px rgba(0,0,0,0.2),
                0 0 20px rgba(253, 180, 29, 0.2);
            max-width: 90%;
            margin-left: auto;
            margin-right: auto;
        }

        .hero-title-l2 {
            font-size: 50px;
            font-weight: 900;
            line-height: 110%;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: -3px;
            color: #fff;
            text-shadow: 
                0 2px 4px rgba(0,0,0,0.2),
                0 0 20px rgba(253, 180, 29, 0.2);
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
        }

        .hero-subtitle {
            font-size: 36px;
            color: var(--accent-primary);
            margin-bottom: 60px;
            text-transform: uppercase;
            letter-spacing: 4px;
            font-weight: 600;
        }

        .prize-amount {
            font-size: 160px;
            font-weight: 900;
            color: var(--accent-primary);
            text-shadow: 0 0 10px rgba(253, 180, 29, 0.3);
            margin: 60px 0;
            letter-spacing: -6px;
            line-height: 1;
        }

        /* Countdown */
        .countdown-wrapper {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 30px 40px;
            margin: 40px auto;
            max-width: 800px;
        }

        .countdown-title {
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: var(--text-muted);
            margin-bottom: 30px;
            font-weight: 600;
        }

        .countdown {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            background: none;
            border: none;
            padding: 0;
            margin-bottom: 0;
        }
        .countdown-inline .countdown-number {
            font-size: 64px;
            font-weight: 700;
            color: var(--text-primary);
            font-variant-numeric: tabular-nums;
            line-height: 1;
            background: none;
            border: none;
            min-width: 60px;
            text-align: center;
        }
        .countdown-colon {
            font-size: 64px;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0 8px;
            line-height: 1;
        }
        .countdown-labels {
            display: flex;
            justify-content: center;
            gap: 0;
            margin-top: 8px;
        }
        .countdown-label {
            font-size: 14px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
            min-width: 60px;
            text-align: center;
        }
        @media (max-width: 480px) {
            .countdown-inline .countdown-number, .countdown-colon {
                font-size: 36px;
            }
            .countdown-label {
                font-size: 10px;
                min-width: 36px;
            }
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin: 80px 0;
        }

        .info-box {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 40px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .info-box:hover {
            background: var(--bg-card-hover);
            border-color: var(--accent-primary);
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
        }

        .info-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 60px;
            height: 60px;
            background: var(--gradient-primary);
            opacity: 0.1;
        }

        .info-icon {
            width: 80px;
            height: 80px;
            background: var(--gradient-primary);
            border: none;
            margin-bottom: 30px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: 900;
            color: var(--bg-primary);
        }

        .info-box h3 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .info-box p {
            color: var(--text-secondary);
            line-height: 1.8;
            font-size: 18px;
            white-space: pre-line;
        }

        /* Timeline */
        .timeline-section {
            margin: 80px 0;
        }

        .timeline-track {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 20px;
            position: relative;
            overflow: hidden;
        }

        .timeline-dates {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            color: var(--text-secondary);
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            gap: 8px;
        }

        .timeline-bar {
            background: var(--gradient-primary);
            padding: 25px;
            text-align: center;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: var(--bg-primary);
            box-shadow: var(--glow-primary);
            font-size: 18px;
        }

        /* --- Make competition period dates stand out more --- */
        .timeline-dates {
            font-size: 42px !important;
            font-weight: 900 !important;
            color: var(--accent-primary) !important;
            text-shadow: 0 4px 20px rgba(253,180,29,0.3), 0 0 4px #000;
            letter-spacing: 2px;
            margin-bottom: 20px;
            opacity: 1 !important;
            line-height: 1.2;
        }
        .timeline-dates span {
            flex: 1;
            text-align: center;
            font-stretch: expanded;
        }
        .timeline-bar {
            font-size: 18px !important;
            font-weight: 600 !important;
            color: var(--bg-primary) !important;
            background: var(--gradient-primary) !important;
            box-shadow: var(--glow-primary) !important;
            letter-spacing: 1px !important;
            margin-top: 0 !important;
        }
        @media (max-width: 480px) {
            .timeline-dates {
                font-size: 18px !important;
            }
        }

        /* Prize Pool */
        .prize-section {
            margin: 80px 0;
        }

        .prize-container {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 80px 60px;
            position: relative;
            overflow: hidden;
        }

        .prize-header {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
            margin-bottom: 60px;
        }

        .prize-info {
            text-align: left;
        }

        .prize-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-muted);
            margin-bottom: 20px;
        }

        .prize-total {
            font-size: 120px;
            font-weight: 900;
            color: var(--accent-primary);
            line-height: 1;
            margin-bottom: 20px;
            letter-spacing: -4px;
        }
        @media (max-width: 1280px) {
            .prize-total {
                font-size: 100px;
            }
        }
        @media (max-width: 1024px) {
            .prize-total {
                font-size: 80px;
            }
        }

        .prize-subtitle {
            color: var(--text-secondary);
            font-size: 16px;
            line-height: 1.8;
            white-space: pre-line;
        }

        .prize-stats {
            display: flex;
            flex-direction: column;
            gap: 30px;
            border-left: 1px solid var(--border-accent);
            padding-left: 60px;
        }

        .prize-stat-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .prize-stat-label {
            font-size: 14px;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .prize-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            text-align: right;
        }



        /* Leaderboard */
        .leaderboard-section {
            margin: 80px 0;
        }

        .leaderboard-container {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 40px;
        }

        .leaderboard-tabs {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
        }

        .leaderboard-tab {
            background: var(--bg-secondary);
            color: var(--text-secondary);
            padding: 15px 30px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 1px solid var(--border-color);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .leaderboard-tab.active {
            background: var(--gradient-primary);
            color: var(--bg-primary);
            border-color: var(--accent-primary);
        }

        .leaderboard-tab:hover:not(.active) {
            background: var(--bg-card);
            color: var(--text-primary);
            border-color: var(--accent-primary);
        }

        .leaderboard-info {
            margin-bottom: 30px;
        }

        .leaderboard-info p {
            color: var(--text-muted);
            font-size: 14px;
            margin-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border-color);
        }

        th {
            padding: 20px;
            text-align: left;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 12px;
            color: var(--text-muted);
        }

        .no-data {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }

        .no-data-icon {
            width: 80px;
            height: 80px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: 700;
            color: var(--text-muted);
        }

        .no-data-text {
            color: var(--text-muted);
            font-size: 16px;
        }

        /* Rules Section */
        .rules-section {
            margin: 80px 0;
        }

        .section-title {
            font-size: 36px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: 40px;
            background: linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .rules-container {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 40px;
        }

        .rule-item {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }

        .rule-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .rule-number {
            min-width: 40px;
            height: 40px;
            background: var(--gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: var(--bg-primary);
            flex-shrink: 0;
        }

        .rule-text {
            color: var(--text-secondary);
            line-height: 1.8;
            flex: 1;
        }

        /* Notice Section */
        .notice-container {
            background: var(--bg-card);
            border: 2px solid var(--accent-secondary);
            padding: 40px;
            position: relative;
            overflow: hidden;
        }

        .notice-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-secondary);
        }

        .notice-item {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .notice-item:last-child {
            margin-bottom: 0;
        }

        .notice-number {
            color: var(--accent-secondary);
            font-weight: 700;
            min-width: 20px;
        }

        .notice-text {
            color: var(--text-secondary);
            line-height: 1.8;
        }

        /* CTA Section */
        .cta-section {
            text-align: center;
            padding: 120px 0;
        }

        .cta-button {
            background: var(--gradient-primary);
            color: var(--bg-primary);
            padding: 25px 100px;
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 3px;
            border: none;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: var(--glow-primary);
        }

        .cta-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 40px rgba(253, 180, 29, 0.4);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .content-wrapper {
                padding: 0 20px;
            }

            .hero-title {
                font-size: 56px;
            }

            .prize-amount {
                font-size: 100px;
            }

            .countdown {
                grid-template-columns: repeat(2, 1fr);
            }

            .info-grid {
                grid-template-columns: 1fr;
            }

            .prize-header {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .prize-stats {
                border-left: none;
                border-top: 1px solid var(--border-accent);
                padding-left: 0;
                padding-top: 40px;
            }

            .prize-tier {
                flex-direction: row;
                text-align: left;
                gap: 10px;
                padding: 15px 20px;
            }

            .prize-tier.tier-1,
            .prize-tier.tier-2,
            .prize-tier.tier-3 {
                padding: 18px 20px;
            }

            .prize-tier.tier-1 .prize-tier-amount {
                font-size: 24px;
            }

            .prize-tier.tier-2 .prize-tier-amount {
                font-size: 22px;
            }

            .prize-tier.tier-3 .prize-tier-amount {
                font-size: 20px;
            }

            .prize-tier.tier-1 .prize-rank,
            .prize-tier.tier-2 .prize-rank,
            .prize-tier.tier-3 .prize-rank {
                padding: 6px 16px;
                font-size: 14px;
                min-width: 120px;
            }

            .prize-total {
                font-size: 72px;
            }



            .section-title {
                font-size: 28px;
            }

            .cta-button {
                padding: 20px 60px;
                font-size: 16px;
            }

            .floating-logos {
                display: block;
            }
            
            .logo-float:nth-child(n+4) {
                display: none;
            }
            
            .logo-float {
                animation-duration: 40s !important;
            }

            .hero-watermark {
                width: 400px;
                animation: none;
            }

            .hero-video-bg {
                object-fit: cover;
            }
        }

        @media (max-width: 480px) {
            .hero-title {
                font-size: 42px;
            }

            .prize-amount {
                font-size: 72px;
            }

            .countdown-number {
                font-size: 36px;
            }

            .prize-total {
                font-size: 56px;
            }

            .prize-container {
                padding: 40px 20px;
            }


        }

        /* Timeline Styles */
        .timeline-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .timeline-design-label {
            color: #fb923c;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .timeline-card {
            background-color: #000000;
            border-radius: 48px;
            border: 4px solid rgba(251, 146, 60, 0.5);
            padding: 32px;
            position: relative;
        }

        .timeline-header {
            background: linear-gradient(to right, #f97316, #ea580c);
            color: #000000;
            text-align: center;
            padding: 12px 0;
            border-radius: 16px;
            margin-bottom: 32px;
            font-weight: 900;
            font-size: 18px;
        }

        .timeline-content {
            position: relative;
        }

        .timeline-line {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            width: 4px;
            background: linear-gradient(to bottom, #fb923c, #ea580c);
            transform: translateX(-50%);
        }

        .timeline-dates-wrapper {
            position: relative;
        }

        .timeline-date-row {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
        }

        .timeline-date-row:last-child {
            margin-bottom: 0;
        }

        .timeline-date-left {
            flex: 1;
            text-align: right;
        }

        .timeline-date-right {
            flex: 1;
            text-align: left;
        }

        .timeline-spacer {
            flex: 1;
            visibility: hidden;
        }

        .timeline-label {
            color: #9ca3af;
            font-size: 14px;
            margin: 0 0 8px 0;
        }

        .timeline-year {
            font-size: 60px;
            font-weight: 900;
            color: #ffffff;
            line-height: 0.9;
            margin: 0;
        }

        .timeline-month {
            font-size: 50px;
            font-weight: 900;
            line-height: 0.9;
            margin: 12px 0 0 0;
        }

        .timeline-date-left .timeline-month {
            color: #fb923c;
        }

        .timeline-date-right .timeline-month {
            color: #f97316;
        }

        .timeline-dot {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            position: relative;
            z-index: 10;
            flex-shrink: 0;
        }

        .timeline-dot-start {
            background-color: #fb923c;
        }

        .timeline-dot-end {
            background-color: #ea580c;
        }

        /* Timeline Responsive Styles */
        @media (max-width: 640px) {
            .timeline-container { 
                padding: 8px; 
            }
            .timeline-card { 
                padding: 12px; 
                border-radius: 20px; 
                border-width: 2px; 
            }
            .timeline-header { 
                font-size: 12px; 
                padding: 8px 0; 
                border-radius: 10px; 
                margin-bottom: 16px; 
            }
            .timeline-line { 
                width: 2px; 
            }
            .timeline-date-row { 
                gap: 8px; 
                margin-bottom: 24px; 
            }
            .timeline-dot { 
                width: 12px; 
                height: 12px; 
            }
            .timeline-label { 
                font-size: 9px; 
                margin: 0 0 2px 0; 
            }
            .timeline-year { 
                font-size: 48px; 
            }
            .timeline-month { 
                font-size: 42px; 
                margin: 6px 0 0 0; 
            }
        }

        @media (max-width: 380px) {
            .timeline-container { 
                padding: 6px; 
            }
            .timeline-card { 
                padding: 10px; 
                border-radius: 16px; 
            }
            .timeline-header { 
                font-size: 10px; 
                padding: 6px 0; 
                margin-bottom: 12px; 
            }
            .timeline-date-row { 
                gap: 6px; 
                margin-bottom: 20px; 
            }
            .timeline-dot { 
                width: 10px; 
                height: 10px; 
            }
            .timeline-label { 
                font-size: 8px; 
                margin: 0 0 1px 0; 
            }
            .timeline-year { 
                font-size: 36px; 
            }
            .timeline-month { 
                font-size: 32px; 
                margin: 4px 0 0 0; 
            }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
            .timeline-year { 
                font-size: 80px; 
            }
            .timeline-month { 
                font-size: 72px; 
                margin: 10px 0 0 0; 
            }
        }

        @media (min-width: 1025px) {
            .timeline-card { 
                padding: 40px; 
            }
            .timeline-header { 
                font-size: 20px; 
                padding: 14px 0; 
                margin-bottom: 40px; 
            }
            .timeline-date-row { 
                margin-bottom: 40px; 
            }
            .timeline-year { 
                font-size: 96px; 
            }
            .timeline-month { 
                font-size: 84px; 
                margin: 12px 0 0 0; 
            }
        }

        `
      }} />

      <div className="competition-page">
        <div className="main-container">
          {/* Hero Section */}
          <section className="hero-section">
            {/* Video Background */}
            <video className="hero-video-bg" autoPlay muted loop playsInline preload="auto">
              <source src="./background.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="hero-bg-overlay"></div>

            {/* ADEN Logo Animation */}
            <div className="floating-logos">
              <img className="logo-float" src="./adentextlogo.svg" alt="ADEN" />
              <img className="logo-float" src="./adentextlogo.svg" alt="ADEN" />
              <img className="logo-float" src="./adentextlogo.svg" alt="ADEN" />
              <img className="logo-float" style={{ width: '180px', top: '25%', left: '-180px', animationDelay: '9s', animationDuration: '22s' }} src="./adentextlogo.svg" alt="ADEN" />
              <img className="logo-float" style={{ width: '240px', bottom: '30%', right: '-240px', animation: 'float-diagonal-reverse 28s infinite ease-in-out', animationDelay: '12s' }} src="./adentextlogo.svg" alt="ADEN" />
              <img className="logo-float" style={{ width: '160px', top: '70%', left: '-160px', animation: 'float-zigzag 20s infinite ease-in-out', animationDelay: '15s', opacity: 0.025 }} src="./adentextlogo.svg" alt="ADEN" />
              <img className="logo-float" style={{ width: '200px', top: '50%', right: '-200px', animation: 'float-circle 35s infinite linear', animationDelay: '18s', opacity: 0.02 }} src="./adentextlogo.svg" alt="ADEN" />
            </div>

            <div className="hero-content">
              <h1 className="hero-title">{t('extend.competition.title')}</h1>
              <h1 className="hero-title-l2">{t('extend.competition.title-l2')}</h1>
              <p className="hero-subtitle">{t('extend.competition.subtitle')}</p>
              <div className="prize-amount">$500,000</div>
              <p style={{ fontSize: '24px', color: '#fff', marginTop: '-20px', letterSpacing: '2px' }}>{t('extend.competition.prizePool')}</p>

              <div className="countdown-wrapper">
                <div className="countdown-title">{countdownTitle}</div>
                <div className="countdown countdown-inline">
                  <span className="countdown-number">{countdown.days}</span>
                  <span className="countdown-colon"> : </span>
                  <span className="countdown-number">{countdown.hours}</span>
                  <span className="countdown-colon"> : </span>
                  <span className="countdown-number">{countdown.minutes}</span>
                  <span className="countdown-colon"> : </span>
                  <span className="countdown-number">{countdown.seconds}</span>
                </div>
                <div className="countdown-labels">
                  <span className="countdown-label">{t('extend.competition.days')}</span>
                  <span className="countdown-label" style={{ margin: '0 18px' }}>{t('extend.competition.hours')}</span>
                  <span className="countdown-label" style={{ margin: '0 18px' }}>{t('extend.competition.minutes')}</span>
                  <span className="countdown-label">{t('extend.competition.seconds')}</span>
                </div>
              </div>
            </div>
          </section>

          <div className="content-wrapper">
            {/* Info Grid */}
            <section className="info-grid">
              <div className="info-box">
                <div className="info-icon">01</div>
                <h3>{t('extend.competition.eligibility')}</h3>
                <p>{t('extend.competition.eligibilityDesc')}</p>
              </div>
              <div className="info-box">
                <div className="info-icon">02</div>
                <h3>{t('extend.competition.tradingPairs')}</h3>
                <p>{t('extend.competition.tradingPairsDesc')}</p>
              </div>
            </section>

            {/* Timeline */}
            <section className="timeline-section">
              <div className="timeline-container">
                <div className="timeline-card">
                  <div className="timeline-header">
                    {t('extend.competition.competitionPeriod')}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-line"></div>
                    <div className="timeline-dates-wrapper">
                      <div className="timeline-date-row">
                        <div className="timeline-date-left">
                          <p className="timeline-label">{t('extend.competition.startPeriod')}</p>
                          <p className="timeline-year">2025</p>
                          <p className="timeline-month">{t('extend.competition.startDate')}</p>
                        </div>
                        <div className="timeline-dot timeline-dot-start"></div>
                        <div className="timeline-spacer"></div>
                      </div>
                      <div className="timeline-date-row">
                        <div className="timeline-spacer"></div>
                        <div className="timeline-dot timeline-dot-end"></div>
                        <div className="timeline-date-right">
                          <p className="timeline-label">{t('extend.competition.endPeriod')}</p>
                          <p className="timeline-year">2025</p>
                          <p className="timeline-month">{t('extend.competition.endDate')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prize Pool */}
            <section className="prize-section">
              <div className="prize-container">
                <div className="prize-header">
                  <div className="prize-info">
                    <div className="prize-label">{t('extend.competition.totalPrizePool')}</div>
                    <div className="prize-total">$500,000</div>
                    <p className="prize-subtitle">{t('extend.competition.prizePoolDesc')}</p>
                  </div>
                  <div className="prize-stats">
                    <div className="prize-stat-item">
                      <span className="prize-stat-label">{t('extend.competition.totalWinners')}</span>
                      <span className="prize-stat-value">500</span>
                    </div>
                    <div className="prize-stat-item">
                      <span className="prize-stat-label">{t('extend.competition.tradingFee')}</span>
                      <span className="prize-stat-value">0%</span>
                    </div>
                    <div className="prize-stat-item">
                      <span className="prize-stat-label">{t('extend.competition.competitionPeriodDays')}</span>
                      <span className="prize-stat-value">17 Days</span>
                    </div>
                  </div>
                </div>

                {/* Competitions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-6xl mx-auto p-4">
                  {/* Trading Volume Competition */}
                  <div className="bg-black border-[3px] border-orange-500/30 rounded-[20px] md:rounded-3xl p-8 md:p-10 relative overflow-hidden hover:border-orange-500/60 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(251,146,60,0.2)]">
                    <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-orange-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-4 md:mb-5 min-h-[120px]">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-black font-black text-2xl md:text-[28px]">1</span>
                        </div>
                        <h3 className="text-[28px] md:text-4xl font-black text-white flex-1">{t('extend.competition.tradingVolume')}</h3>
                      </div>
                      <div className="text-5xl md:text-[64px] font-black text-orange-400 leading-none mb-5 md:mb-6">
                        250,000 <span className="text-orange-500">USDT</span>
                      </div>
                      <div className="text-2xl md:text-[32px] font-bold text-gray-400 mt-5 md:mt-6 pt-5 md:pt-6 border-t-[3px] border-orange-500/20">
                        <span className="font-black text-orange-400 text-[32px] md:text-[40px]">250</span> WINNERS
                      </div>

                      {/* Prize Breakdown */}
                      <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center py-2 px-3 bg-yellow-600/30 rounded-lg border border-yellow-300">
                          <span className="text-yellow-200 font-bold text-sm md:text-base">1st place</span>
                          <span className="text-yellow-200 font-black text-lg md:text-xl">$25,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                          <span className="text-gray-300 font-bold text-sm md:text-base">2nd place</span>
                          <span className="text-gray-300 font-black text-lg md:text-xl">$15,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-orange-600/10 rounded-lg border border-orange-600/20">
                          <span className="text-orange-500 font-bold text-sm md:text-base">3rd place</span>
                          <span className="text-orange-500 font-black text-lg md:text-xl">$10,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">4th - 10th</span>
                          <span className="text-gray-400 font-bold text-base">$5,000 each</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">11th - 50th</span>
                          <span className="text-gray-400 font-bold text-base">$2,000 each</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">51st - 100th</span>
                          <span className="text-gray-400 font-bold text-base">$1,000 each</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">101st - 250th</span>
                          <span className="text-gray-400 font-bold text-base">$233 each</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ROI Competition */}
                  <div className="bg-black border-[3px] border-orange-500/30 rounded-[20px] md:rounded-3xl p-8 md:p-10 relative overflow-hidden hover:border-orange-500/60 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(251,146,60,0.2)]">
                    <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-orange-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-4 md:mb-5 min-h-[120px]">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-black font-black text-2xl md:text-[28px]">2</span>
                        </div>
                        <h3 className="text-[28px] md:text-4xl font-black text-white flex-1">{t('extend.competition.pnlCompetition')}</h3>
                      </div>
                      <div className="text-5xl md:text-[64px] font-black text-orange-400 leading-none mb-5 md:mb-6">
                        250,000 <span className="text-orange-500">USDT</span>
                      </div>
                      <div className="text-2xl md:text-[32px] font-bold text-gray-400 mt-5 md:mt-6 pt-5 md:pt-6 border-t-[3px] border-orange-500/20">
                        <span className="font-black text-orange-400 text-[32px] md:text-[40px]">250</span> WINNERS
                      </div>

                      {/* Prize Breakdown */}
                      <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center py-2 px-3 bg-yellow-600/30 rounded-lg border border-yellow-300">
                          <span className="text-yellow-200 font-bold text-sm md:text-base">1st place</span>
                          <span className="text-yellow-200 font-black text-lg md:text-xl">$25,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                          <span className="text-gray-300 font-bold text-sm md:text-base">2nd place</span>
                          <span className="text-gray-300 font-black text-lg md:text-xl">$15,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-orange-600/10 rounded-lg border border-orange-600/20">
                          <span className="text-orange-500 font-bold text-sm md:text-base">3rd place</span>
                          <span className="text-orange-500 font-black text-lg md:text-xl">$10,000</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">4th - 10th</span>
                          <span className="text-gray-400 font-bold text-base">$5,000 each</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">11th - 50th</span>
                          <span className="text-gray-400 font-bold text-base">$2,000 each</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">51st - 100th</span>
                          <span className="text-gray-400 font-bold text-base">$1,000 each</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-400 font-medium text-sm">101st - 250th</span>
                          <span className="text-gray-400 font-bold text-base">$233 each</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Leaderboard */}
            <section className="leaderboard-section">
              <div className="leaderboard-container">
                <CampaignLeaderboard campaignId={137} minVolume={0} />
              </div>
            </section>

            {/* Rules Section */}
            <section className="rules-section">
              <h2 className="section-title">{t('extend.competition.competitionRules')}</h2>
              <div className="rules-container">
                <div className="rule-item">
                  <div className="rule-number">1</div>
                  <div className="rule-text">{t('extend.competition.rule1')}</div>
                </div>
                <div className="rule-item">
                  <div className="rule-number">2</div>
                  <div className="rule-text">{t('extend.competition.rule2')}</div>
                </div>

                <div className="rule-item">
                  <div className="rule-number">3</div>
                  <div className="rule-text">
                    {t('extend.competition.rule3').split('\n').map((line: string, idx: number) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
                <div className="rule-item">
                  <div className="rule-number">4</div>
                  <div className="rule-text">{t('extend.competition.rule4')}</div>
                </div>
                <div className="rule-item">
                  <div className="rule-number">5</div>
                  <div className="rule-text">{t('extend.competition.rule5')}</div>
                </div>
                <div className="rule-item">
                  <div className="rule-number">6</div>
                  <div className="rule-text">{t('extend.competition.rule6')}</div>
                </div>
                <div className="rule-item">
                  <div className="rule-number">7</div>
                  <div className="rule-text">{t('extend.competition.rule7')}</div>
                </div>
                <div className="rule-item">
                  <div className="rule-number">8</div>
                  <div className="rule-text">{t('extend.competition.rule8')}</div>
                </div>
              </div>
            </section>

            {/* Notice Section */}
            <section className="rules-section">
              <h2 className="section-title">{t('extend.competition.notice')}</h2>
              <div className="notice-container">
                <div className="notice-item">
                  <span className="notice-number">1.</span>
                  <span className="notice-text">{t('extend.competition.notice1')}</span>
                </div>
                <div className="notice-item">
                  <span className="notice-number">2.</span>
                  <span className="notice-text">{t('extend.competition.notice2')}</span>
                </div>
                <div className="notice-item">
                  <span className="notice-number">3.</span>
                  <span className="notice-text">{t('extend.competition.notice3')}</span>
                </div>
                <div className="notice-item">
                  <span className="notice-number">4.</span>
                  <span className="notice-text">{t('extend.competition.notice4')}</span>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
              <Link to="/perp/PERP_BTC_USDC" className="cta-button">{t('extend.competition.startTrading')}</Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Competition() {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('extend.competition.title');
  }, [t]);

  return (
    <Scaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/competition",
      }}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
      }}
    >
      <CompetitionContent />
    </Scaffold>
  );
}