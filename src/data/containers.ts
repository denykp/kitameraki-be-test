import type { Container } from "@azure/cosmos";
import { getDatabase } from "./cosmos.client";

// tiny in-memory cache for container refs
const cache = new Map<string, Container>();

export async function getTasksContainer(): Promise<Container> {
  const key = "Tasks";
  if (cache.has(key)) return cache.get(key)!;

  const database = await getDatabase();
  const { container } = await database.containers.createIfNotExists({
    id: "Tasks",
    partitionKey: { paths: ["/organizationId"] },
  });

  cache.set(key, container);
  return container;
}
