const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

const testUser = { username: "goose", password: "honk" };
const testUser2 = { username: "villager", password: "No Geese" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
afterAll(async (done) => {
  await db.destroy();
  done();
});

describe("server.js", () => {
  describe("register endpoint", () => {
    beforeEach(async () => {
      await db("users").truncate();
    });
    it("should return 201 if successful", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser);
      expect(res.status).toBe(201);
    });
    it("should return user created", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser2);
      expect(res.body.username).toBe(testUser2.username);
    });
  });

  describe("login endpoint", () => {
    beforeEach(async () => {
      await db("users").truncate();
      await request(server).post("/api/auth/register").send(testUser);
    });
    it("should return 200 if successful", async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      expect(res.status).toBe(200);
    });
    it("should return token", async () => {
      const res = await request(server).post("/api/auth/login").send(testUser);
      const keys = Object.keys(res.body);
      expect(keys).toContain("token");
    });
  });

  describe("jokes endpoint", () => {
    beforeEach(async () => {
      await db("users").truncate();
      await request(server).post("/api/auth/register").send(testUser);
    });
    it("should return 200 if successful", async () => {
      const {
        body: { token },
      } = await request(server).post("/api/auth/login").send(testUser);
      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", token);
      expect(res.status).toBe(200);
    });
    it("should return json object", async () => {
      const {
        body: { token },
      } = await request(server).post("/api/auth/login").send(testUser);
      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", token);
      expect(res.type).toEqual("application/json");
    });
  });
});
