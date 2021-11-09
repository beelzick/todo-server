import { MongoClient } from 'mongodb'
import './env'

declare const process: {
    env: {
        [key: string]: string;
    }
}

const uri = process.env.MONGO_URI
const dbName = process.env.MONGO_DB_NAME

const returnContext = async () => {
    let db
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

export default returnContext