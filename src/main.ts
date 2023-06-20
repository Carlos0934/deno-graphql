import 'https://deno.land/std@0.192.0/dotenv/load.ts'
import { serve } from 'server'
import { Hono } from 'hono'
import { createYogaHandler } from './common/config/graphql/yoga.ts'

const hono = new Hono()
const yogaHandler = await createYogaHandler()
hono.get('/graphql', (ctx) => yogaHandler(ctx.req.raw, {}))
hono.post('/graphql', (ctx) => yogaHandler(ctx.req.raw, {}))

serve(hono.fetch)
