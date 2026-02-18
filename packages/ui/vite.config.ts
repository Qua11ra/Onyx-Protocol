import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts"

export default defineConfig({
	plugins: [
		react(),
		dts({ 
			include: ['src'],
			outDir: 'dist',
			insertTypesEntry: true,
			exclude: ["./**/**/*.stories.tsx"]
		})
	],
	server: {
		port: 3001,
	},
	build: {
		cssMinify: false,
		minify: false, //TODO AAAAAAAAAAAAAAAAAAAAAAAA FUCK YOU I CANT GET IT TO WORK
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			formats: ["es"],
			fileName: "index"
		},
		outDir: "./dist",
		sourcemap: true,

		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime"
			],
			output: {
				entryFileNames: "[name].js",
				preserveModules: true,
				preserveModulesRoot: "src",
				exports: 'named'
			},
		},
		emptyOutDir: true,
		cssCodeSplit: true
	},
	publicDir: false,
	css: {
		postcss: './postcss.config.js'
	}
});
