import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import {
  BudgetEntity,
  CategoryEntity,
  ExpenseEntity,
  IncomeEntity,
  UserEntity,
} from '../entities';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expenes_tracker',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: false,
  entities: [
    UserEntity,
    CategoryEntity,
    ExpenseEntity,
    IncomeEntity,
    BudgetEntity,
  ],
});

export default AppDataSource;
