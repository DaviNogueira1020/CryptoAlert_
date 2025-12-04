export function sendSuccess(res: any, data?: any, message?: string, status = 200) {
  return res.status(status).json({ 
    success: true, 
    message: message || 'Sucesso',
    data: data || null 
  });
}

export function sendError(res: any, message: string, status = 400) {
  return res.status(status).json({ 
    success: false, 
    error: message 
  });
}
