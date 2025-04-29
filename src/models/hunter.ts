import { model, Schema } from "mongoose";
import { HunterI } from "../include/interface.js";
import { Race, Ubication } from "../include/enum.js";


// Basic schema for the Hunter model
export const hunterSchema = new Schema<HunterI>({
  personId: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  race: {
    type: String,
    enum: Object.values(Race),
    required: true
  },
  location: {
    type: String,
    enum: Object.values(Ubication),
    required: true
  }
});

export const HunterModel = model<HunterI>("Hunter", hunterSchema);