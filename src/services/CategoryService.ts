import { CategoryEntity, CategoryType } from '../entities';
import { HttpError } from '../middlewares/ErrorMiddleware';
import { CategoryRepository } from '../repositories/CategoryRepository';

interface CreateCategoryPayload {
  name: string;
  type: CategoryType;
}

interface UpdateCategoryPayload {
  name?: string;
  type?: CategoryType;
}

export class CategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async list(): Promise<CategoryEntity[]> {
    return this.categoryRepository.findAll();
  }

  async getById(id: string): Promise<CategoryEntity> {
    if (!id) {
      throw new HttpError(400, 'Category id is required');
    }

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    return category;
  }

  async create(payload: CreateCategoryPayload): Promise<CategoryEntity> {
    if (!payload?.name || !payload?.type) {
      throw new HttpError(400, 'name and type are required');
    }

    const name = String(payload.name).trim();
    if (!name) {
      throw new HttpError(400, 'name is required');
    }

    if (![CategoryType.INCOME, CategoryType.EXPENSE].includes(payload.type)) {
      throw new HttpError(400, "type must be 'INCOME' or 'EXPENSE'");
    }

    const existing = await this.categoryRepository.findByName(name);
    if (existing) {
      throw new HttpError(409, 'Category name already exists');
    }

    return this.categoryRepository.createAndSave({
      name,
      type: payload.type,
    });
  }

  async update(id: string, payload: UpdateCategoryPayload): Promise<CategoryEntity> {
    if (!id) {
      throw new HttpError(400, 'Category id is required');
    }

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    const hasName = payload?.name !== undefined;
    const hasType = payload?.type !== undefined;
    if (!hasName && !hasType) {
      throw new HttpError(400, 'At least one of name or type is required');
    }

    if (hasName) {
      const name = String(payload.name).trim();
      if (!name) {
        throw new HttpError(400, 'name is required');
      }

      const existing = await this.categoryRepository.findByName(name);
      if (existing && existing.id !== id) {
        throw new HttpError(409, 'Category name already exists');
      }

      category.name = name;
    }

    if (hasType) {
      if (![CategoryType.INCOME, CategoryType.EXPENSE].includes(payload.type!)) {
        throw new HttpError(400, "type must be 'INCOME' or 'EXPENSE'");
      }
      category.type = payload.type!;
    }

    return this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    if (!id) {
      throw new HttpError(400, 'Category id is required');
    }

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    await this.categoryRepository.deleteById(id);
  }
}
