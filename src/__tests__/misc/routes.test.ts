import supertest = require("supertest");
import http from "node:http";
import server from "@/server";

const httpServer = http.createServer(server);

describe("misc routes", () => {
  it("should return 200 for /healthcheck", async () => {
    const { status } = await supertest(httpServer).get("/healthcheck");

    expect(status).toBe(200);
  });

  it("should return 404 for unknown route", async () => {
    const { status } = await supertest(httpServer).get("/unknown-route");

    expect(status).toBe(404);
  });
});
