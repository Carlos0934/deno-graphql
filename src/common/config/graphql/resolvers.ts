import { Resolvers } from '../../types/graphql.ts'

import merge from 'deep-merge'

const localResolvers: Resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
}

function mergeResolvers(resolvers: Resolvers[]): Resolvers {
  return merge(...resolvers)
}

export const resolvers = mergeResolvers([localResolvers])
