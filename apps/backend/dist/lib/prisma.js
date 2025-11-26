"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Use require to avoid possible ESM/CJS interop issues with generated Prisma client
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("@prisma/client");
const PrismaClient = pkg.PrismaClient;
const prisma = globalThis.prisma ?? new PrismaClient({ log: ["query", "error", "warn"] });
if (process.env.NODE_ENV !== "production")
    globalThis.prisma = prisma;
exports.default = prisma;
//# sourceMappingURL=prisma.js.map