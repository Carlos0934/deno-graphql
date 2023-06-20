export class Criteria {
  readonly cursor?: string | null
  readonly limit?: number | null

  readonly order?: Order
  readonly filters?: Filters

  constructor({
    cursor,
    limit,
    order,
    filters,
  }: {
    cursor?: string | null
    limit?: number | null
    order?: Order
    filters?: Filters
  }) {
    this.cursor = cursor
    this.limit = limit
    this.order = order
    this.filters = filters
  }
}

export class Order {
  readonly field: string
  readonly direction: Direction

  constructor(field: string, direction: Direction) {
    this.field = field
    this.direction = direction
  }
}

export class Filters {
  readonly filters: Filter[]

  constructor(filters: Filter[]) {
    this.filters = filters
  }
  get hasFilters(): boolean {
    return this.filters.length > 0
  }
}

export class Filter {
  readonly field: string
  readonly operator: FilterOperator
  readonly value: FilterValue

  constructor(field: string, operator: FilterOperator, value: FilterValue) {
    this.field = field
    this.operator = operator
    this.value = value
  }
}

export type FilterValue = unknown | unknown[]
export enum FilterOperator {
  EQ,
  NE,
  GT,
  GTE,
  LT,
  LTE,
  IN,
  NIN,
}

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class CriteriaParser {
  abstract parse<T>(criteria: Criteria): T
  abstract parseFilters<T>(filters: Filters): T
}
