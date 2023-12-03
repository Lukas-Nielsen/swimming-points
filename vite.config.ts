import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: true,
			eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
		}),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
		}),
	],
	base: "/",
	server: { open: true, port: 3000 },
	build: { emptyOutDir: true, outDir: "./build" },
});
