export {};
import { Router } from "express";
import { env } from "../config/env";

const router = Router();

router.get("/", (req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/ready", (req: any, res: any) => {
  // Simple readiness; could add DB ping
  res.json({ status: "ok", env: env.NODE_ENV });
});

router.get("/live", (req: any, res: any) => {
  res.json({ status: "ok" });
});

export default router;
