import { model, Schema } from "mongoose";
import { GoodI } from "../include/interface.js";
import { Material } from "../include/enum.js";

// Basic schema for the Merchant model
export const hunterSchema = new Schema<GoodI>({
  id: { 
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

export const HunterModel = model<GoodI>("Good", hunterSchema);