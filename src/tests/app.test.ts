import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app";
import User from "../models/user.model";
import Rider from "../models/rider.model";
import Order from "../models/order.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeAll(async () => {
  await User.deleteMany({});
  await Rider.deleteMany({});
  await Order.deleteMany({});
});

describe("DLVR Logistics API", () => {
  const adminSecret = process.env.ADMIN_SECRET;
  const riderSecret = process.env.RIDER_SECRET;
  let userToken: string;
  let adminToken: string;
  let riderToken: string;
  let userId: string;
  let riderId: string;
  let orderId: string;

  // Helper function to register a user and get a token
  const registerAndLogin = async ({
    email,
    password,
    riderSecret,
    adminSecret,
  }: {
    email: string;
    password: string;
    riderSecret?: string;
    adminSecret?: string;
  }) => {
    await request(app)
      .post("/api/auth/register")
      .send({ email, password, riderSecret, adminSecret });

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    return loginResponse.body.accessToken;
  };

  beforeAll(async () => {
    userToken = await registerAndLogin({
      email: "user@test.com",
      password: "password123",
    });

    adminToken = await registerAndLogin({
      email: "admin@test.com",
      password: "password123",
      adminSecret,
    });

    riderToken = await registerAndLogin({
      email: "rider@test.com",
      password: "password123",
      riderSecret,
    });
  });

  describe("Authentication", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "newuser@test.com", password: "password123" });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user");
      userId = response.body.user.id;
    });

    it("should login an existing user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password: "password123" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("accessToken");
    });

    it("should get user profile", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "user@test.com");
    });
  });

  describe("User Management", () => {
    it("should get all users (admin only)", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.users)).toBeTruthy();
    });

    it("should get current authenticated user", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "user@test.com");
    });

    it("should get user by ID (admin)", async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "newuser@test.com");
    });

    it("should get user by ID (rider)", async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${riderToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "newuser@test.com");
    });

    it("should update current authenticated user", async () => {
      const response = await request(app)
        .put(`/api/users/me`)
        .set("Authorization", `Bearer ${riderToken}`)
        .send({ email: "updatedrider@test.com" });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty(
        "email",
        "updatedrider@test.com",
      );
    });

    it("should update a user (admin only)", async () => {
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "updated@test.com" });
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "updated@test.com");
    });

    it("should delete current authenticated user", async () => {
      const response = await request(app)
        .delete(`/api/users/me`)
        .set("Authorization", `Bearer ${riderToken}`);
      expect(response.status).toBe(204);
    });

    it("should delete a user (admin only)", async () => {
      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(204);
    });
  });

  describe("Rider Management", () => {
    it("should create a new rider", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "newrider@test.com",
        password: "password123",
        riderSecret,
      });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("rider");
      riderId = response.body.rider.id;
    });

    it("should login new rider", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "newrider@test.com", password: "password123" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("rider");
      expect(response.body).toHaveProperty("accessToken");
      riderToken = response.body.accessToken;
    });

    it("should get all riders (admin)", async () => {
      const response = await request(app)
        .get("/api/riders")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.riders)).toBeTruthy();
    });

    it("should get all riders (user)", async () => {
      const response = await request(app)
        .get("/api/riders")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.riders)).toBeTruthy();
    });

    it("should get current authenticated rider", async () => {
      const response = await request(app)
        .get("/api/riders/me")
        .set("Authorization", `Bearer ${riderToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "newrider@test.com");
    });

    it("should get rider by ID (admin)", async () => {
      const response = await request(app)
        .get(`/api/riders/${riderId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "newrider@test.com");
    });

    it("should get rider by ID (user)", async () => {
      const response = await request(app)
        .get(`/api/riders/${riderId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty("email", "newrider@test.com");
    });

    it("should update a rider (admin)", async () => {
      const response = await request(app)
        .put(`/api/riders/${riderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          location: {
            type: "Point",
            coordinates: [1, 1],
          },
        });
      expect(response.status).toBe(200);
      expect(response.body.rider.location.coordinates).toEqual([1, 1]);
    });

    it("should update a rider (rider)", async () => {
      const response = await request(app)
        .put(`/api/riders/me`)
        .set("Authorization", `Bearer ${riderToken}`)
        .send({
          location: {
            type: "Point",
            coordinates: [1, 1],
          },
        });
      expect(response.status).toBe(200);
      expect(response.body.rider.location.coordinates).toEqual([1, 1]);
    });
  });

  describe("Order Management", () => {
    it("should register and login a new user", async () => {
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send({ email: "newuser2@test.com", password: "password123" });
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body).toHaveProperty("user");
      userId = registerResponse.body.user.id;

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ email: "newuser2@test.com", password: "password123" });
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty("user");
      expect(loginResponse.body).toHaveProperty("accessToken");
      userToken = loginResponse.body.accessToken;
    });

    it("should create a new order (user only)", async () => {
      const response = await request(app)
        .post("/api/orders")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          pickupLocation: {
            type: "Point",
            coordinates: [12, 53],
          },
          dropoffLocation: {
            type: "Point",
            coordinates: [1, 1],
          },
        });
      expect(response.status).toBe(201);
      expect(response.body.order).toHaveProperty("pickupLocation");
      expect(response.body.order).toHaveProperty("dropoffLocation");
      orderId = response.body.order.id;
    });

    it("should get all orders (user, rider, and admin)", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.orders)).toBeTruthy();
    });

    it("should get order by ID (user)", async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${userToken}`);
      expect(response.status).toBe(200);
      expect(response.body.order).toHaveProperty("status");
    });

    it("should get order by ID (rider)", async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${riderToken}`);
      expect(response.status).toBe(200);
      expect(response.body.order).toHaveProperty("status");
    });

    it("should get order by ID (admin)", async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.order).toHaveProperty("status");
    });

    it("should update an order (admin)", async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "ongoing" });
      expect(response.status).toBe(200);
      expect(response.body.order).toHaveProperty("status", "ongoing");
    });

    it("should update an order (rider)", async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${riderToken}`)
        .send({ status: "completed" });
      expect(response.status).toBe(200);
      expect(response.body.order).toHaveProperty("status", "completed");
    });

    it("should delete an order (admin only)", async () => {
      const response = await request(app)
        .delete(`/api/orders/${orderId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(response.status).toBe(204);
    });
  });
});
