import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (_request, response) => {
  response.status(200).json({
    message: 'Expend Tracker API is running',
  });
});

export default app;
