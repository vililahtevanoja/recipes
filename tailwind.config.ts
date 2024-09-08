import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/routes/**/*.{js,ts,jsx,tsx,mdx,svelte}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
