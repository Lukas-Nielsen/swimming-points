import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import oxlintPlugin from "vite-plugin-oxlint";

export default defineConfig({
	plugins: [react(), oxlintPlugin()],
	resolve: {
		alias: {
			"@tabler/icons-react":
				"@tabler/icons-react/dist/esm/icons/index.mjs",
		},
	},
	base: "/",
	server: { open: true, port: 3000 },
	build: { emptyOutDir: true, outDir: "./build" },
});
