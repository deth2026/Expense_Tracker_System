import express from 'express';
import { errorMiddleware } from './middlewares/ErrorMiddleware';
import indexRoutes from './routes/IndexRoutes';

const app = express();

app.use(express.json());

app.use((request, _response, next) => {
  if (!request.url) {
    next();
    return;
  }

  try {
    const requestUrl = new URL(request.url, 'http://localhost');
    const sanitizedPathname = requestUrl.pathname
      .replace(/(%0a|%0d|%09)+$/gi, '')
      .replace(/[\s\u0000-\u001F\u007F]+$/g, '');

    request.url = `${sanitizedPathname}${requestUrl.search}`;
  } catch {
    request.url = request.url
      .replace(/(%0a|%0d|%09)+$/gi, '')
      .trim();
  }

  next();
});

app.use('/api', indexRoutes);

app.get('/', (_request, response) => {
  response.status(200).json({
    message: 'Expend Tracker API is running',
  });
});

app.use(errorMiddleware);

export default app;
