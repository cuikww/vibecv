import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Gunakan DIRECT_URL dari .env khusus untuk keperluan CLI (seperti db push)
    url: process.env["DIRECT_URL"], 
  },
});