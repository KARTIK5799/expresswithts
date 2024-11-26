import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import userRouter from './user/userRouter';
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the app' });
});
 
app.use("/api/users",userRouter);






app.use(globalErrorHandler);

export default app;
