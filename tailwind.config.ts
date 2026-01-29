import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          500: "var(--accent-coral)",
        },
        page: "var(--bg-page)",
        card: "var(--bg-card)",
        "card-highlight": "var(--bg-card-highlight)",
        "border-empty": "var(--border-empty)",
        "border-subtle": "var(--border-subtle)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-disabled": "var(--text-disabled)",
        "accent-green": "var(--accent-green)",
        "accent-orange": "var(--accent-orange)",
        "accent-yellow": "var(--accent-yellow)",
        "badge-green": "var(--badge-green)",
        "badge-yellow": "var(--badge-yellow)",
      },
      borderRadius: {
        sm2: "var(--radius-sm)",
        lg2: "var(--radius-lg)",
        xl2: "var(--radius-xl)",
      },
      fontFamily: {
        bricolage: ["Bricolage Grotesque", "sans-serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
