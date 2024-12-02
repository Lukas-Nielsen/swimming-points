import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import oxlintPlugin from "vite-plugin-oxlint";

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: "autoUpdate",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
			},
		}),
		oxlintPlugin(),
	],
	base: "/",
	server: { open: true, port: 3000 },
	build: { emptyOutDir: true, outDir: "./build" },
});
