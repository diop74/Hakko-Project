/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
    	extend: {
    		fontFamily: {
    			manrope: ['Manrope', 'sans-serif'],
    			'dm-sans': ['DM Sans', 'sans-serif']
    		},
    		colors: {
    			haako: {
    				DEFAULT: '#1B5E20',
    				50: '#E8F5E9',
    				100: '#C8E6C9',
    				200: '#A5D6A7',
    				300: '#81C784',
    				400: '#66BB6A',
    				500: '#4CAF50',
    				600: '#43A047',
    				700: '#388E3C',
    				800: '#2E7D32',
    				900: '#1B5E20',
    				950: '#052e16'
    			},
    			sand: {
    				DEFAULT: '#F5F5F0',
    				dark: '#EBEBE6'
    			},
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				1: 'hsl(var(--chart-1))',
    				2: 'hsl(var(--chart-2))',
    				3: 'hsl(var(--chart-3))',
    				4: 'hsl(var(--chart-4))',
    				5: 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
