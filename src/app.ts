import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config'

const app = express();


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
const error=createHttpError(400,"Something wehnt wrong ");
throw error;

  res.json({ message: 'Welcome to the app' });
});




const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === 'development' ? err.stack : undefined,
  });
};


app.use(errorHandler);

export default app;
