
import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";
import { GoodModel } from "../src/models/good.js";

const firstGood = {
  name: "Sword",
  description: "A sharp blade",
  material: "Acero de Mahakam",
  weight: 3,
  crownValue: 100,
  stock: 10,
};

beforeEach(async () => {
  await GoodModel.deleteMany();
  await new GoodModel(firstGood).save();
});

describe("POST /good", () => {
  test("Should successfully create a new good", async () => {
    await request(app)
      .post("/good")
      .send({
        name: "Shield",
        description: "A sturdy shield",
        material: "Madera de roble de las colinas grises",
        weight: 5,
        crownValue: 150,
        stock: 5,
      })
      .expect(201);
  });

  test("Should get an error when creating a duplicate good", async () => {
    await request(app).post("/good").send(firstGood).expect(500);
  });
});

describe("GET /good", () => {
  test("Should get a good by name", async () => {
    await request(app).get("/good?name=Sword").expect(200);
  });

  test("Should not find a good by name", async () => {
    await request(app).get("/good?name=Bow").expect(404);
  });
});

describe("GET /good/:id", () => {
  test("Should get a good by ID", async () => {
    const good = await GoodModel.findOne({ name: "Sword" });
    const response = await request(app).get(`/good/${good?._id}`).expect(200);
    expect(response.body).to.include({
      name: "Sword",
      description: "A sharp blade",
      material: "Acero de Mahakam",
      weight: 3,
      crownValue: 100,
      stock: 10,
    });
  });

  test("Should not find a good by invalid ID", async () => {
    await request(app).get("/good/invalidID").expect(500);
  });
});

describe("PATCH /good", () => {
  test("Should successfully update a good by name", async () => {
    const response = await request(app)
      .patch("/good?name=Sword")
      .send({ stock: 15 })
      .expect(200);
    expect(response.body).to.include({
      name: "Sword",
      stock: 15,
    });
  });
});

describe("DELETE /good", () => {
  test("Should successfully delete a good by name", async () => {
    await request(app).delete("/good?name=Sword").expect(200);
  });

  test("Should get an error when deleting a non-existent good", async () => {
    await request(app).delete("/good?name=Bow").expect(404);
  });
});
