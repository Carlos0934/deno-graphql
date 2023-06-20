import {
  Criteria,
  Direction,
  FilterOperator,
  Filters,
  Order,
} from '../../utils/criteria/types.ts'
import { ObjectId } from 'mongo'
import { Filter as MongoFilter, FindOptions } from 'mongo'

const operators: Record<FilterOperator, string> = {
  [FilterOperator.EQ]: '$eq',
  [FilterOperator.NE]: '$ne',
  [FilterOperator.GT]: '$gt',
  [FilterOperator.GTE]: '$gte',
  [FilterOperator.LT]: '$lt',
  [FilterOperator.LTE]: '$lte',
  [FilterOperator.IN]: '$in',
  [FilterOperator.NIN]: '$nin',
}
export class MongoCriteriaParser {
  parse(criteria: Criteria) {
    const filters: MongoFilter<Record<string, unknown>> = criteria.filters
      ? this.parseFilters(criteria.filters)
      : {}
    const sort = criteria.order ? this.parseOrder(criteria.order) : {}
    const options = criteria.limit ? { limit: criteria.limit } : undefined

    if (criteria.cursor) {
      filters._id = {
        $gt: new ObjectId(criteria.cursor),
      }
    }

    return {
      filter: filters,
      sort,
      options,
    }
  }
  private parseOrder(order: Order): FindOptions['sort'] {
    const sort: FindOptions['sort'] = {}

    if (order) {
      sort[order.field] = order.direction === Direction.ASC ? 1 : -1
    }

    return sort
  }

  parseFilters(filters: Filters): MongoFilter<Record<string, unknown>> {
    const mongoFilters: MongoFilter<Record<string, unknown>> = {}

    if (filters) {
      filters.filters.forEach((filter) => {
        const operator = operators[filter.operator]

        mongoFilters[filter.field] = {
          [operator]: filter.field === '_id'
            ? new ObjectId(filter.value as string)
            : filter.value,
        }
      })
    }

    return mongoFilters
  }
}
