import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import albumsRouter from './routes/albums';

export const createServer = (): Application => {
  const app: Application = express();
  
  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*'
  }));
  
  app.use(express.json());
  
  // Root route
  app.get('/', (req: Request, res: Response) => {
    res.json({ 
      message: "Hit the /albums endpoint to retrieve a list of albums!" 
    });
  });
  
  // Albums routes
  app.use('/albums', albumsRouter);
  
  return app;
};
