import { model, Schema } from "mongoose";
import { GoodI } from "../include/interface.js";
import { Material } from "../include/enum.js";

/**
 * Schema for the good model.
 * This schema defines the structure of the Goods documents in the MongoDB database.
 */
const goodSchema = new Schema<GoodI>({
  name: { 
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        // Verifica que sólo la primera letra sea mayúscula
        const regex = /^[A-Z][a-z]*$/;
        return regex.test(value);
      },
      message: "El nombre debe comenzar con una letra mayúscula y solo contener letras",
    },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => value.length <= 50,
      message: "La descripción no debe tener más de 50 caracteres",
    },
  },
  material: {
    type: String,
    enum: Object.values(Material),
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  crownValue: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1, 
  },
});

export const GoodModel = model<GoodI>("Good", goodSchema);