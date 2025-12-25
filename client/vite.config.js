import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },

    server: {
    proxy: {
      '/user': 'http://localhost:5000',
      '/question': 'http://localhost:5000',
      '/answer': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
