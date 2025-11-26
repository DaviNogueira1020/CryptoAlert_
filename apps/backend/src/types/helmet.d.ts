declare module 'helmet' {
  import { RequestHandler } from 'express';
  function helmet(): RequestHandler;
  namespace helmet {}
  export = helmet;
}
