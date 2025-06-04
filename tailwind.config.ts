import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#0088cc',
        light:    '#54a9eb',
        dark:     '#006bb3',
        bg:       '#f4f4f5',
        'msg-out':'#effdde',
        'msg-in': '#ffffff',
      },
    },
  },
  plugins: [],
} satisfies Config
