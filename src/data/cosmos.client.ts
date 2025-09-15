import { CosmosClient, Database } from "@azure/cosmos";

const conn = process.env.COSMOSDB_CONN;
if (!conn) throw new Error("COSMOSDB_CONN is not set");

const client = new CosmosClient(conn);
let db: Database | undefined;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    const { database } = await client.databases.createIfNotExists({
      id: process.env.COSMOS_DATABASE,
    });
    db = database;
  }
  return db;
}
