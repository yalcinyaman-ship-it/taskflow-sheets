/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                background: '#e0e5ec',
                surface: '#e0e5ec',
                primary: '#6d5dfc',
                text: '#4a4a4a',
                gs: {
                    yellow: '#FBB829',
                    red: '#C8102E',
                }
            },
            boxShadow: {
                neumorph: '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
                'neumorph-inset': 'inset 6px 6px 10px 0 rgba(163,177,198, 0.7), inset -6px -6px 10px 0 rgba(255,255,255, 0.8)',
                'neumorph-sm': '5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5)',
                glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            backgroundImage: {
                'gs-gradient': 'linear-gradient(135deg, #FBB829 0%, #C8102E 100%)',
            }
        },
    },
    plugins: [],
}
