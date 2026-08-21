import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesQueryDto } from './dto/list-categories-query.dto';

type CategoryNode = Category & { children: CategoryNode[] };

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(accountId: string, filters: ListCategoriesQueryDto = {}) {
    if (filters.parentId) {
      return this.prisma.category.findMany({
        where: { accountId, parentId: filters.parentId },
        orderBy: { name: 'asc' },
      });
    }

    const categories = await this.prisma.category.findMany({
      where: { accountId },
      orderBy: { name: 'asc' },
    });
    return this.buildTree(categories);
  }

  async create(accountId: string, dto: CreateCategoryDto) {
    if (dto.parentId) {
      await this.assertCategoryBelongsToAccount(accountId, dto.parentId);
    }
    await this.assertNameAvailable(accountId, dto.parentId ?? null, dto.name);

    try {
      return await this.prisma.category.create({
        data: { accountId, parentId: dto.parentId, name: dto.name },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una categoría con este nombre');
      }
      throw error;
    }
  }

  private buildTree(categories: Category[]): CategoryNode[] {
    const nodeById = new Map<string, CategoryNode>(
      categories.map((category) => [
        category.id,
        { ...category, children: [] },
      ]),
    );

    const roots: CategoryNode[] = [];
    for (const category of nodeById.values()) {
      if (category.parentId) {
        nodeById.get(category.parentId)?.children.push(category);
      } else {
        roots.push(category);
      }
    }
    return roots;
  }

  private async assertCategoryBelongsToAccount(
    accountId: string,
    categoryId: string,
  ) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, accountId },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada en esta cuenta');
    }
  }

  /**
   * Postgres no aplica @@unique cuando parentId es NULL (cada NULL cuenta
   * como distinto), así que las categorías raíz se validan aquí en vez de
   * depender solo de la constraint de base de datos.
   */
  private async assertNameAvailable(
    accountId: string,
    parentId: string | null,
    name: string,
  ) {
    const existing = await this.prisma.category.findFirst({
      where: { accountId, parentId, name },
    });
    if (existing) {
      throw new ConflictException('Ya existe una categoría con este nombre');
    }
  }
}
