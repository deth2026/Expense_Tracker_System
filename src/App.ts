import express from 'express';
import { errorMiddleware } from './middlewares/ErrorMiddleware';
import indexRoutes from './routes/IndexRoutes';

const app = express();

app.use(express.json());
app.use('/api', indexRoutes);

app.get('/', (_request, response) => {
  response.status(200).json({
    message: 'Expend Tracker API is running',
  });
});

app.use(errorMiddleware);

export default app;
