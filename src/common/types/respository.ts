import { Criteria, Filters } from '../utils/criteria/types.ts'
import { Node, PageInfo } from './graphql.ts'
import type { ZodSchema } from 'zod'
export type Entity = Node

export type UpdateParam<T> = T
export type CreateParam<T> = Omit<T, '_id' | 'createdAt'>

export type SaveParam<T> = T | CreateParam<T>

export class ConnectionPage<T> {
  readonly edges: T[]
  readonly pageInfo: PageInfo
  constructor(edges: T[], pageInfo: PageInfo) {
    this.edges = edges
    this.pageInfo = pageInfo
  }
}

export interface Repository<T extends Entity> {
  find(criteria?: Criteria): Promise<ConnectionPage<T>>
  findOne(criteria: Criteria): Promise<T | undefined>
  findById(id: string): Promise<T | undefined>
  save(entity: SaveParam<T>): Promise<T | undefined>
  delete(criteria: Filters): Promise<boolean>
}

export type EntitySchema<T> = ZodSchema<Omit<T, '_id' | 'createdAt'>>
