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
                evalio: {
                    dark: '#1A1F2C',
                    purple: {
                        light: '#D6BCFA',
                        DEFAULT: '#9B87F5',
                        medium: '#7E69AB',
                        dark: '#6E59A5',
                        vivid: '#8B5CF6',
                    },
                    blue: {
                        bright: '#1EAEDB',
                        sky: '#33C3F0',
                        light: '#0FA0CE',
                    },
                    glow: {
                        purple: '0 0 15px rgba(139, 92, 246, 0.5)',
                        blue: '0 0 15px rgba(30, 174, 219, 0.5)',
                    }
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
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.05)' }
                },
                'flow': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                },
                'particle-move': {
                    '0%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
                    '25%': { transform: 'translate3d(100px, -50px, 0) rotate(90deg)' },
                    '50%': { transform: 'translate3d(50px, -100px, 0) rotate(180deg)' },
                    '75%': { transform: 'translate3d(-50px, -50px, 0) rotate(270deg)' },
                    '100%': { transform: 'translate3d(0, 0, 0) rotate(360deg)' }
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
                'flow': 'flow 15s ease infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'particle-move': 'particle-move 20s ease infinite alternate',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards'
			},
            backgroundImage: {
                'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
                'gradient-shine': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                'gradient-purple-blue': 'linear-gradient(135deg, #9B87F5 0%, #33C3F0 100%)',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
                'display': ['Lexend', 'sans-serif'],
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
