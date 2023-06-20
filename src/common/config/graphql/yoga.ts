import { createSchema, createYoga } from 'yoga'

import { resolvers } from './resolvers.ts'
import { createContext, GraphQLContext } from './context.ts'
import { authDirective } from './directives.ts'

export const createYogaHandler = async () => {
  const typeDefs = await Deno.readTextFile('./schema.graphql')
  const { authDirectiveTransformer } = authDirective('auth')

  let schema = createSchema<GraphQLContext>({
    typeDefs: [typeDefs],
    resolvers,
  })

  schema = authDirectiveTransformer(schema)

  const yoga = createYoga({
    schema,
    context: createContext,
    graphiql: true,
  })

  return yoga.handleRequest
}
