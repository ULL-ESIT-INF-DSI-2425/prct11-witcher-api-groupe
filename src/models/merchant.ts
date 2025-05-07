import { model, Schema } from "mongoose";
import { MerchantI } from "../include/interface.js";
import { Type, Ubication } from "../include/enum.js";


/**
 * Schema for the Merchant model
 * This schema defines the structure of the Merchant documents in the MongoDB database.
 */
const merchantSchema = new Schema<MerchantI>({
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
  type: {
    type: String,
    enum: Object.values(Type),
    required: true
  },
  location: {
    type: String,
    enum: Object.values(Ubication),
    required: true
  }
});

export const MerchantModel = model<MerchantI>("Merchant", merchantSchema);