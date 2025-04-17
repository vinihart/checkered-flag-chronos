import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Racing theme colors
				racing: {
					red: '#E10600',       // F1 primary red
					black: '#121212',     // Dark background
					darkgrey: '#1F1F1F',  // Secondary background
					grey: '#6C6C6C',      // Neutral text
					silver: '#F1F1F1',    // Light text
					yellow: '#FFCB00',    // Warning/highlight
					green: '#00A15F',     // Positive/improving time
					purple: '#800080',    // Best sector time
					blue: '#0600EF'       // Team color (e.g., Red Bull)
				},
				// Status colors
				status: {
					improved: '#00A15F',  // Green for improved time
					slower: '#E10600',    // Red for slower time
					best: '#800080',      // Purple for best time
					neutral: '#FFFFFF'    // White for neutral
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'position-change': {
					'0%, 100%': {
						transform: 'translateX(0)'
					},
					'10%, 90%': {
						transform: 'translateX(3px)'
					},
					'20%, 80%': {
						transform: 'translateX(0)'
					},
					'30%, 70%': {
						transform: 'translateX(3px)'
					},
					'40%, 60%': {
						transform: 'translateX(0)'
					},
					'50%': {
						transform: 'translateX(3px)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'position-change': 'position-change 1s ease-in-out'
			},
			fontFamily: {
				'racing': ['Roboto', 'Arial', 'sans-serif'],
				'formula': ['Titillium Web', 'Arial', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
