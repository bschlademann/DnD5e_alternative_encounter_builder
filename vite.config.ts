import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/DnD5e_alternative_encounter_builder/",
  build: { outDir: "docs" },
});
