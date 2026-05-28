import { Repository } from 'typeorm';
import AppDataSource from '../config/Database';
import { CategoryEntity } from '../entities';

export class CategoryRepository {
  private readonly repository: Repository<CategoryEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(CategoryEntity);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<CategoryEntity | null> {
    return this.repository.findOne({ where: { name } });
  }

  async createAndSave(payload: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = this.repository.create(payload);
    return this.repository.save(category);
  }

  async save(category: CategoryEntity): Promise<CategoryEntity> {
    return this.repository.save(category);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
