import { model, Schema } from "mongoose";
import { HunterI } from "../include/interface.js";
import { Race, Ubication } from "../include/enum.js";


// Basic schema for the Hunter model
const hunterSchema = new Schema<HunterI>({
  name: { 
    type: String, 
    unique: true, 
    required: true, 
    trim: true 
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