import { model, Schema } from "mongoose";
import { HunterI } from "../include/interface.js";
import { Race, Ubication } from "../include/enum.js";


// Basic schema for the Hunter model
const hunterSchema = new Schema<HunterI>({
  name: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true,
    validate: {
      validator: (value: string) => {
        // Verifica que solo contenga letras y que cada palabra empiece con mayúscula
        const regex = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/;
        return regex.test(value);
      },
      message: "El nombre solo debe contener letras y cada palabra debe empezar con mayúscula",
    },
  },
  race: {
    type: String,
    enum: Object.values(Race),
    required: true, 
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    required: true,
    enum: Object.values(Ubication),
  },
  transaction: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Transaction'
  }
});

export const HunterModel = model<HunterI>('Hunter', hunterSchema);