import { getDirective, MapperKind, mapSchema } from 'graphql-utils'
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from 'graphql'
import { GraphQLContext } from './context.ts'
import { GraphQLSchemaWithContext } from 'yoga'

export function authDirective(directiveName: string) {
  const typeDirectiveArgumentMaps: Record<string, unknown> = {}

  const authDirectiveTransformer = (
    schema: GraphQLSchemaWithContext<GraphQLContext>,
  ): GraphQLSchemaWithContext<GraphQLContext> =>
    mapSchema(schema, {
      [MapperKind.TYPE]: (type) => {
        const authDirective = getDirective(
          schema as unknown as GraphQLSchema,
          type,
          directiveName,
        )?.[0]
        if (authDirective) {
          typeDirectiveArgumentMaps[type.name] = authDirective
        }

        return undefined
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        const authDirective =
          getDirective(schema, fieldConfig, directiveName)?.[0] ??
            typeDirectiveArgumentMaps[typeName]
        if (authDirective) {
          const { requires } = authDirective as { requires: string }
          if (requires) {
            const { resolve = defaultFieldResolver } = fieldConfig
            fieldConfig.resolve = function (
              source: unknown,
              args: unknown,
              context: GraphQLContext,
              info: unknown,
            ) {
              if (requires !== context.user?.role) {
                throw new GraphQLError('Not authorized')
              }

              return resolve(source, args, context, info)
            }
            return fieldConfig
          }
        }
      },
    })

  return {
    authDirectiveTransformer,
  }
}
