import dotenv from 'dotenv';
import app from './App';
import AppDataSource from './config/Database';

dotenv.config();

const port = Number(process.env.PORT || 3000);

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log(`Database connected: ${process.env.DB_NAME || 'expenes_tracker'}`);

    app.listen(port, () => {
      console.log(`HTTP server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();
