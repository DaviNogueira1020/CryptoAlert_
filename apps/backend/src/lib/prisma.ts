// Use require to avoid possible ESM/CJS interop issues with generated Prisma client
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("@prisma/client");
const PrismaClient = pkg.PrismaClient;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {}
  }

  // Attach prisma to globalThis for hot reload in dev
  // eslint-disable-next-line no-var
  var prisma: any | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient({ log: ["query", "error", "warn"] });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
