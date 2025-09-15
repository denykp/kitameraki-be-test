import { app } from "@azure/functions";
import {
  BulkDeleteTasks,
  DeleteTask,
  GetTask,
  GetTasks,
  InsertTask,
  UpdateTask,
} from "../services/tasks";

app.http("GetTasks", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "tasks",
  handler: GetTasks,
});

app.http("InsertTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "tasks",
  handler: InsertTask,
});

app.http("UpdateTask", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "tasks/{id}",
  handler: UpdateTask,
});

app.http("GetTask", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "tasks/{id}",
  handler: GetTask,
});

app.http("DeleteTask", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "tasks/{id}",
  handler: DeleteTask,
});

app.http("BulkDeleteTasks", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "tasks",
  handler: BulkDeleteTasks,
});
