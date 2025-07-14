/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

const number0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}`) };

const px0_10 = { ...Array.from(Array(11)).map((_, i) => `${i}px`) };
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) };
const px0_500 = { ...Array.from(Array(501)).map((_, i) => `${i}px`) };
const px0_1000 = { ...Array.from(Array(1001)).map((_, i) => `${i}px`) };
const px0_2000 = { ...Array.from(Array(2001)).map((_, i) => `${i}px`) };


module.exports = {
  prefix: 'dc-',
  darkMode: 'class',
  greenMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./app/**/**/*.{js,jsx,ts,tsx}", "./app/layouts/**/*.{js,jsx,ts,tsx}", "./app/components/**/*.{js,jsx,ts,tsx}", "./app/components/analysis/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    fontFamily: {
      pre: ['Pretendard Variable', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'sans-serif'],
      'pre-medium': ['Pretendard Variable', 'system-ui', 'sans-serif'],
      'pre-semibold': ['Pretendard Variable', 'system-ui', 'sans-serif'],
      ibm: ['IBM-Plex-Sans-KR'],
    },
    extend: {
      borderWidth: px0_10,
      fontSize: px0_100,
      lineHeight: px0_100,
      minWidth: { ...px0_2000, '1680': '1680px', '1920': '1920px' },
      minHeight: { ...px0_2000, '1680': '1680px', '1920': '1920px' },
      maxWidth: px0_2000,
      maxHeight: px0_2000,
      width: { ...px0_2000, '1680': '1680px', '1920': '1920px' },
      height: { ...px0_2000, '1680': '1680px', '1920': '1920px' },
      margin: px0_500,
      marginBottom: px0_500,
      marginTop: px0_500,
      marginLeft: px0_500,
      padding: px0_500,
      paddingBottom: px0_500,
      paddingTop: px0_500,
      paddingLeft: px0_500,
      paddingRight: px0_500,
      spacing: px0_200,
      gap: px0_500,
      zIndex: number0_100,
      colors: {
			dark: {
				900: "#111",
				800: "#181818",
				700: "#303030",
				600: "#8b8b8b",
				500: "#6e6e6e",
				400: "#898989",
				300: "#606060",
			},
			pink: "#de8edf",
			brown: "#261e1e",
		},
      opacity: {
        1: "0.01",
        2: "0.02",
        4: "0.04",
        6: "0.06",
        8: "0.08",
        16: "0.16",
        20: "0.2",
      },
      animation: {
        marquee: 'marquee 15s linear infinite',
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slash: 'slash 1s linear 0s infinite normal',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        slash: {
          '0%': { left: '-15px' },
          '100%': { left: '0px' },
        },
      },
      fontWeight: {
        medium: '500',
        semibold: '600',
      },
    },
  },
  plugins: [
    plugin(function({addVariant}) {
      // here is your CSS selector - could be anything
      addVariant('theme-white', '.theme-white &')
      addVariant('theme-dark', '.theme-dark &')
    })
  ],
}