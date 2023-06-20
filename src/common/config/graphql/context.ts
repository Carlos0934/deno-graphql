import { Role } from '../../types/graphql.ts'
import { YogaInitialContext } from 'yoga'

declare module 'yoga' {
  interface YogaInitialContext {
    localAddr: Deno.Addr
    remoteAddr: Deno.Addr
  }
}

export interface GraphQLContext extends YogaInitialContext {
  user: {
    id: string
    role: Role
  } | null
}

export async function createContext(
  initialContext: YogaInitialContext,
  getUser?: (token: string) => Promise<{ id: string; role: Role } | null>,
): Promise<GraphQLContext> {
  const user = (await getUser?.(
    initialContext.request.headers.get('Authorization') || '',
  )) || null

  return {
    ...initialContext,
    user,
  }
}
