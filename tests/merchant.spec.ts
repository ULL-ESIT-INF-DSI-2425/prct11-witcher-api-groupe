import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";
import { MerchantModel } from "../src/models/merchant.js";

const firstMerchant = {
  name: "Vesemir",
  type: "Herrero", // Valor válido según el enum Type
  location: "Kaer Morhen", // Valor válido según el enum Ubication
};

beforeEach(async () => {
  await MerchantModel.deleteMany();
  await new MerchantModel(firstMerchant).save();
});

describe("POST /merchant", () => {
  test("Should successfully create a new merchant", async () => {
    await request(app)
      .post("/merchant")
      .send({
        name: "Lambert",
        type: "Alquimista", // Valor válido según el enum Type
        location: "Novigrado", // Valor válido según el enum Ubication
      })
      .expect(201);
  });

  test("Should get an error when creating a duplicate merchant", async () => {
    await request(app).post("/merchant").send(firstMerchant).expect(500);
  });
});

describe("GET /merchant", () => {
  test("Should get a merchant by name", async () => {
    await request(app).get("/merchant?name=Vesemir").expect(200);
  });

  test("Should not find a merchant by name", async () => {
    await request(app).get("/merchant?name=Eskel").expect(404);
  });
});

describe("GET /merchant/:id", () => {
  test("Should get a merchant by ID", async () => {
    const merchant = await MerchantModel.findOne({ name: "Vesemir" });
    await request(app).get(`/merchant/${merchant?._id}`).expect(200);
  });

  test("Should get a merchant by ID", async () => {
    const merchant = await MerchantModel.findOne({ name: "Vesemir" });
    const response = await request(app).get(`/merchant/${merchant?._id}`).expect(200);
    expect(response.body).to.include({
      name: "Vesemir",
      type: "Herrero",
      location: "Kaer Morhen",
    });
  })

  test("Should not find a merchant by invalid ID", async () => {
    await request(app).get("/merchant/invalidID").expect(500);
  });
});

describe("PATCH /merchant", () => {
  test("Should successfully update a merchant by name", async () => {
    await request(app)
      .patch("/merchant?name=Vesemir")
      .send({ location: "Novigrado" }) // Valor válido según el enum Ubication
      .expect(200);
  });

  test("Should successfully update a merchant by name", async () => {
    const response = await request(app)
      .patch("/merchant?name=Vesemir")
      .send({ location: "Novigrado" })
      .expect(200);
    expect(response.body).to.include({
      name: "Vesemir",
      location: "Novigrado",
    });
  });

  test("Should get an error when updating a non-existent merchant", async () => {
    await request(app).patch("/merchant?name=Eskel").send({ location: "Novigrado" }).expect(404);
  });

  test("Should get an error when updating with invalid fields", async () => {
    await request(app)
      .patch("/merchant?name=Vesemir")
      .send({ invalidField: "Invalid" })
      .expect(400);
  });
});

describe("DELETE /merchant", () => {
  test("Should successfully delete a merchant by name", async () => {
    await request(app).delete("/merchant?name=Vesemir").expect(200);
  });

  test("Should get an error when deleting a non-existent merchant", async () => {
    await request(app).delete("/merchant?name=Eskel").expect(404);
  });
});

describe("DELETE /merchant/:id", () => {
  test("Should successfully delete a merchant by ID", async () => {
    const merchant = await MerchantModel.findOne({ name: "Vesemir" });
    await request(app).delete(`/merchant/${merchant?._id}`).expect(200);
  });

  test("Should get an error when deleting a merchant with invalid ID", async () => {
    await request(app).delete("/merchant/invalidID").expect(500);
  });
});