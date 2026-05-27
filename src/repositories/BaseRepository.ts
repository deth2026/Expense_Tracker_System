import { DeepPartial, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import AppDataSource from '../config/Database';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { IRepository } from './IRepository';

export abstract class BaseRepository<T extends ObjectLiteral & { id: string }>
  implements IRepository<T>
{
  protected readonly repository: Repository<T>;

  protected constructor(entity: new () => T) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async create(payload: Partial<T>): Promise<T> {
    const entity = this.repository.create(payload as DeepPartial<T>);
    return this.repository.save(entity as DeepPartial<T>);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new HttpError(404, 'Resource not found');
    }

    const mergedEntity = this.repository.merge(entity, payload as DeepPartial<T>);
    return this.repository.save(mergedEntity as DeepPartial<T>);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);

    if (!entity) {
      throw new HttpError(404, 'Resource not found');
    }

    await this.repository.remove(entity);
  }
}
