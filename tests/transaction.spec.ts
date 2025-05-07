import { describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/index.js";
import { TransactionModel } from "../src/models/transactions.js";
import { HunterModel } from "../src/models/hunter.js";
import { GoodModel } from "../src/models/good.js";
import { Race, Ubication, Material, TransactionType } from "../src/include/enum.js";

const firstHunter = {
  name: "Eskel",
  race: Race.Brujo,
  location: Ubication.Morhen,
};

const firstGood = {
  name: "Potion",
  description: "A healing potion",
  material: Material.Acero,
  weight: 1,
  crownValue: 100,
  stock: 10,
};

const firstTransaction = {
  consumerName: "Eskel",
  consumerType: "Hunter",
  goods: [{ good: "", quantity: 2 }],
  date: new Date().toISOString(),
  purchaseType: TransactionType.Purchase,
};

let hunterId: string;
let goodId: string;

beforeEach(async () => {
  await TransactionModel.deleteMany();
  await HunterModel.deleteMany();
  await GoodModel.deleteMany();

  const hunter = await new HunterModel(firstHunter).save();
  const good = await new GoodModel(firstGood).save();

  hunterId = hunter._id.toString();
  goodId = good._id.toString();

  firstTransaction.goods[0].good = goodId;
});

describe("GET /transaction", () => {
  test("Should get all transactions", async () => {
    await new TransactionModel({
      consumer: hunterId,
      consumerType: "Hunter",
      goods: [{ good: goodId, quantity: 2 }],
      date: new Date(),
      purchaseType: TransactionType.Purchase,
      totalAmount: 200, // 2 * crownValue (100)
    }).save();

    const response = await request(app).get("/transaction").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
  });
});