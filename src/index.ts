import { ApolloServer } from 'apollo-server'
import { typeDefs } from './typeDefs';
import resolvers from './resolvers';
import { MongoClient } from 'mongodb'
import './lib/loadEnv'

declare const process: {
    env: {
        [key: string]: string;
    }
}

const uri = process.env.MONGO_URI
const dbName = process.env.MONGO_DB_NAME

let db: any

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => {
        if (!db) {
            try {
                const client = new MongoClient(uri)
                await client.connect()
                db = client.db(dbName)
            } catch (e) {
                console.log(e)
            }
        }
        return { db }
    }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});