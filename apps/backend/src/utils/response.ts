export function sendSuccess(res: any, data: any, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendError(res: any, code: string, message: any, status = 400) {
  return res.status(status).json({ success: false, error: { code, message } });
}
