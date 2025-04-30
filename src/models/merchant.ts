import { model, Schema } from "mongoose";
import { MerchantI } from "../include/interface.js";
import { Type, Ubication } from "../include/enum.js";


// Basic schema for the Merchant model
export const merchantSchema = new Schema<MerchantI>({
  personId: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
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