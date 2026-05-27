import { BaseRepository } from '../repositories/BaseRepository';

export abstract class BaseService<T extends { id: string }> {
  protected readonly repository: BaseRepository<T>;

  protected constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
