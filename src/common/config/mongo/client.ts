import { MongoClient } from 'mongo'

export const createMongoDb = async () => {
  const MONGO_URL = Deno.env.get('MONGO_URL') || 'mongodb://127.0.0.1:27017'
  const MONGO_DB = Deno.env.get('MONGO_DB') || 'test'

  const client = new MongoClient()

  await client.connect(MONGO_URL)

  return client.database(MONGO_DB)
}
