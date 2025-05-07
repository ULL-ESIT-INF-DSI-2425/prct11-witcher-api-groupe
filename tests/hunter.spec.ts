import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";
import { HunterModel } from "../src/models/hunter.js";

const firstHunter = {
  name: "Geralt Of Rivia", // Actualizado para cumplir con el validador
  race: "Brujo", // Valor válido según el enum Race
  location: "Kaer Morhen", // Valor válido según el enum Ubication
};

beforeEach(async () => {
  await HunterModel.deleteMany();
  await new HunterModel(firstHunter).save();
});

describe("POST /hunter", () => {
  test("Should successfully create a new hunter", async () => {
    await request(app)
      .post("/hunter")
      .send({
        name: "Yennefer Of Vengerberg", // Actualizado para cumplir con el validador
        race: "Hechicero", // Valor válido según el enum Race
        location: "Novigrado", // Valor válido según el enum Ubication
      })
      .expect(201);
  });

  test("Should get an error when creating a duplicate hunter", async () => {
    await request(app).post("/hunter").send(firstHunter).expect(500);
  });
});

describe("GET /hunter", () => {
  test("Should get a hunter by name", async () => {
    await request(app).get("/hunter?name=Geralt Of Rivia").expect(200);
  });

  test("Should not find a hunter by name", async () => {
    await request(app).get("/hunter?name=Triss Merigold").expect(404);
  });
});

describe("GET /hunter/:id", () => {
  test("Should get a hunter by ID", async () => {
    const hunter = await HunterModel.findOne({ name: "Geralt Of Rivia" });
    const response = await request(app).get(`/hunter/${hunter?._id}`).expect(200);
    expect(response.body).to.include({
      name: "Geralt Of Rivia",
      race: "Brujo",
      location: "Kaer Morhen",
    });
  });

  test("Should not find a hunter by invalid ID", async () => {
    await request(app).get("/hunter/invalidID").expect(400);
  });
});

describe("PATCH /hunter", () => {
  test("Should successfully update a hunter by name", async () => {
    await request(app)
      .patch("/hunter?name=Geralt Of Rivia")
      .send({ location: "Novigrado" }) // Valor válido según el enum Ubication
      .expect(200);
  });

  test("Should successfully update a hunter by name", async () => {
    const response = await request(app)
      .patch("/hunter?name=Geralt Of Rivia")
      .send({ location: "Novigrado" })
      .expect(200);
    expect(response.body).to.include({
      name: "Geralt Of Rivia",
      location: "Novigrado",
    });
  });

  test("Should get an error when updating a non-existent hunter", async () => {
    await request(app).patch("/hunter?name=Triss Merigold").send({ location: "Novigrado" }).expect(404);
  });

  test("Should get an error when updating with invalid fields", async () => {
    await request(app)
      .patch("/hunter?name=Geralt Of Rivia")
      .send({ invalidField: "Invalid" })
      .expect(400);
  });
});

describe("DELETE /hunter", () => {
  test("Should successfully delete a hunter by name", async () => {
    await request(app).delete("/hunter?name=Geralt Of Rivia").expect(200);
  });

  test("Should get an error when deleting a non-existent hunter", async () => {
    await request(app).delete("/hunter?name=Triss Merigold").expect(404);
  });
});

describe("DELETE /hunter/:id", () => {
  test("Should successfully delete a hunter by ID", async () => {
    const hunter = await HunterModel.findOne({ name: "Geralt Of Rivia" });
    await request(app).delete(`/hunter/${hunter?._id}`).expect(200);
  });

  test("Should get an error when deleting a hunter with invalid ID", async () => {
    await request(app).delete("/hunter/invalidID").expect(500);
  });
});