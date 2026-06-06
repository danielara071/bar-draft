import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  allowCypressEnv: true,

  e2e: {
    baseUrl:  "https://localhost:5173/",
    setupNodeEvents(on, config) {

      config.env.TEST_EMAIL = process.env.TEST_EMAIL;
      config.env.TEST_PASSWORD = process.env.TEST_PASSWORD;
      config.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL;
      config.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

      return config;
    },
  },
});