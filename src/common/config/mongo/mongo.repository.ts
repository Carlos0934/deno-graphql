import { Collection, ObjectId } from 'mongo'
import {
  ConnectionPage,
  CreateParam,
  Entity,
  EntitySchema,
  Repository,
  SaveParam,
  UpdateParam,
} from '../../types/respository.ts'
import { Criteria, Filters } from '../../utils/criteria/types.ts'
import { MongoCriteriaParser } from './mongoCriteriaParser.util.ts'

export type FindCursor<T extends Record<string, unknown>> = ReturnType<
  Collection<T>['find']
>

export class MongoRepository<T extends Entity> implements Repository<T> {
  constructor(
    private readonly collection: Collection<T>,
    private readonly schema: EntitySchema<T>,
  ) {}

  private getCursorForCriteria(criteria?: Criteria): FindCursor<T> {
    if (!criteria) {
      return this.collection.find()
    }

    const { filter, sort, options } = new MongoCriteriaParser().parse(criteria)

    const cursor = this.collection.find(filter)
    if (sort) cursor.sort(sort)
    if (options) cursor.limit(options.limit)

    return cursor
  }

  async find(criteria?: Criteria): Promise<ConnectionPage<T>> {
    const cursor = this.getCursorForCriteria(criteria)
    const edges = await cursor.toArray()
    const startCursor = edges[0]?._id
    const endCursor = edges.at(criteria?.limit ?? 0)?._id

    const hasNextPage = !!endCursor

    return new ConnectionPage(edges, {
      hasNextPage,
      startCursor,
      endCursor,
    })
  }

  async findOne(criteria: Criteria): Promise<T | undefined> {
    const cursor = this.getCursorForCriteria(criteria)

    return await cursor.next()
  }
  async findById(id: string): Promise<T | undefined> {
    const objectId = new ObjectId(id)

    return await this.collection.findOne({ _id: objectId })
  }

  async save(entity: SaveParam<T>): Promise<T | undefined> {
    if ('_id' in entity) {
      return await this.update(entity as UpdateParam<T>)
    }

    return await this.create(entity as CreateParam<T>)
  }

  private async update(entity: UpdateParam<T>): Promise<T | undefined> {
    const result = this.schema.safeParse(entity)
    if (!result.success) {
      throw new Error(result.error.message)
    }
    const id = new ObjectId(entity._id)

    const updatedEntity = await this.collection.findAndModify(
      { _id: id },
      {
        new: true,
        upsert: false,
        update: entity,
      },
    )

    return updatedEntity
  }
  private async create(entity: CreateParam<T>): Promise<T> {
    const parseResult = this.schema.safeParse(entity)
    if (!parseResult.success) {
      throw new Error(parseResult.error.message)
    }

    const createdAt = new Date().toISOString()
    const inserted = await this.collection.insertOne({
      ...entity,

      createdAt,
    } as T)
    const result = {
      ...entity,
      _id: inserted,
      createdAt,
    } as T
    return result
  }

  async delete(filters: Filters): Promise<boolean> {
    const parsedFilters = new MongoCriteriaParser().parseFilters(filters)

    const result = await this.collection.deleteMany(parsedFilters)

    return result > 0
  }
}
