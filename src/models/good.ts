import { model, Schema } from "mongoose";
import { GoodI } from "../include/interface.js";
import { Material } from "../include/enum.js";

// Basic schema for the Merchant model
const goodSchema = new Schema<GoodI>({
  personId: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    required: true
  },
  material: {
    type: String,
    enum: Object.values(Material),
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  crownValue: {
    type: Number,
    required: true
  },
});

export const GoodSchema = model<GoodI>("Good", goodSchema);