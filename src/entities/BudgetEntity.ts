import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('budgets')
export class BudgetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ name: 'monthly_limit', type: 'decimal', precision: 10, scale: 2 })
  monthlyLimit!: string;

  @Column({ type: 'varchar', length: 20 })
  month!: string;

  @Column({
    name: 'spent_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  spentAmount!: string;

  @Column({
    name: 'remaining_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  remainingAmount!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.budgets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;
}
