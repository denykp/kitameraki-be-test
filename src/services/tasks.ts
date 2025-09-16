import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getTasksContainer } from "../data/containers";

export async function GetTasks(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const container = await getTasksContainer();
    const orgId = request.query.get("organizationId");
    if (!orgId)
      return { status: 400, jsonBody: { error: "Missing organizationId" } };
    const status = request.query.get("status");
    context.log("status", status);
    const search = request.query.get("search");
    context.log("status", status, String(status || "all").toLowerCase());

    const res = await container.items
      .query({
        query: `SELECT c.id, c.title, c.status FROM c where c.organizationId = @organizationId and (lower(c.status) = lower(@status) or lower(@status) = 'all') and contains(c.title,@search,true)`,
        parameters: [
          { name: "@organizationId", value: orgId },
          { name: "@status", value: String(status || "all") },
          { name: "@search", value: search },
        ],
      })
      .fetchNext();

    return {
      jsonBody: {
        data: res.resources,
      },
      status: 200,
    };
  } catch (error) {
    context.error("GetTasks failed:", error);
    return {
      status: 500,
      jsonBody: { error: "Internal Server Error", message: error },
    };
  }
}

export async function InsertTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const orgId = request.query.get("organizationId");
    if (!orgId)
      return { status: 400, jsonBody: { error: "Missing organizationId" } };

    const body = (await request.json()) as Object;
    const container = await getTasksContainer();

    const { resource } = await container.items.create({
      ...body,
      organizationId: orgId,
    });

    return { jsonBody: resource, status: 200 };
  } catch (error) {
    context.error("InsertTask failed:", error);
    return {
      status: 500,
      jsonBody: { error: "Internal Server Error", message: error },
    };
  }
}

export async function UpdateTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const body = (await request.json()) as object;
    const taskId = request.params.id;
    context.log("taskId", taskId);
    const orgId = request.query.get("organizationId");
    if (!orgId)
      return { status: 400, jsonBody: { error: "Missing organizationId" } };

    const container = await getTasksContainer();

    let patchRequests = [];

    for (let key in body) {
      patchRequests.push({
        op: "set",
        path: `/${key}`,
        value: body[key],
      });
    }

    context.log("patchRequests", patchRequests);
    context.log("existing", await container.item(taskId, orgId).read());

    const { resource } = await container
      .item(taskId, orgId)
      .patch(patchRequests);

    return { jsonBody: resource, status: 200 };
  } catch (error) {
    context.error("UpdateTask failed:", error);
    return {
      status: 500,
      jsonBody: { error: "Internal Server Error", message: error },
    };
  }
}

export async function GetTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const taskId = request.params.id;
    const container = await getTasksContainer();
    const orgId = request.query.get("organizationId");
    if (!orgId)
      return { status: 400, jsonBody: { error: "Missing organizationId" } };

    const { resource } = await container.item(taskId, orgId).read();

    if (!resource)
      return { status: 404, jsonBody: { error: "Task not found" } };

    return {
      jsonBody: {
        data: resource,
      },
      status: 200,
    };
  } catch (error) {
    context.error("GetTask failed:", error);
    return {
      status: 500,
      jsonBody: { error: "Internal Server Error", message: error },
    };
  }
}

export async function DeleteTask(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const taskId = request.params.id;
    const container = await getTasksContainer();
    const orgId = request.query.get("organizationId");
    if (!orgId)
      return { status: 400, jsonBody: { error: "Missing organizationId" } };

    await container.item(taskId, orgId).delete();

    return {
      status: 200,
      jsonBody: {
        message: "Task deleted successfully",
      },
    };
  } catch (error) {
    context.error("DeleteTask failed:", error);
    return {
      status: 500,
      jsonBody: { error: "Internal Server Error", message: error },
    };
  }
}

export async function BulkDeleteTasks(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    const body = (await request.json()) as string[];
    const container = await getTasksContainer();
    const orgId = request.query.get("organizationId");
    if (!orgId)
      return { status: 400, jsonBody: { error: "Missing organizationId" } };

    body.forEach(async (element) => {
      await container.item(element, orgId).delete();
    });

    return { status: 200, jsonBody: { message: "Tasks deleted successfully" } };
  } catch (error) {
    context.error("BulkDeleteTasks failed:", error);
    return {
      status: 500,
      jsonBody: { error: "Internal Server Error", message: error },
    };
  }
}
