import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      screens: {
        'gf': '280px',    // galaxy fold
        'fs': '200px',    // custom small
        'sg': '360px',    // samsung galaxy
        'ss': '361px',    // custom small screen
        'se': '375px',    // iphone SE
        'pro': '390px',   // iphone 12 pro
        'pix': '393px',   // pixel
        'su': '412px',    // samsung ultra
        'a51': '412px',   // samsung a51
        'xr': '414px',    // iphone XR
        'desktop': '1280px',
      },
      colors: {
        white: {
          DEFAULT: '#',
          medium: '#',
          light: '#',
        },
        blue: {
          DEFAULT: '#',
          light: '#',
        },
        red: {
          DEFAULT: '#',
          light: '#',
        },
        black: '#000000',
        gray: {
          DEFAULT: '#',
          light: '#',
        }
      },
    },
  },
  plugins: [],
}

export default config