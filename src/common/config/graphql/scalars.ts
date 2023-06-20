import { DateTimeResolver, ObjectIDResolver } from 'graphql-scalars'
import { Resolvers } from '../../types/graphql.ts'

export const resolvers: Resolvers = {
  ObjectID: ObjectIDResolver,
  DateTime: DateTimeResolver,
}
