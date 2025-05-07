import { Race, Ubication, Material, Type, TransactionType } from "./enum.js";
import { Document, Types } from "mongoose";

/**
 * Interface that represents a Person 
 */
export interface Person extends Document {
  /**
   * Name of the person
   */
  name: string
}

/**
 * Interface that represents a Hunter
 * extends Person
 */
export interface HunterI extends Person {
  /**
   * Race of the hunter
   */
  race: Race;
  /**
   * Location of the hunter
   */
  location: Ubication; 
}

/**
 * Interface that represents a Good
 * extends Person
 */
export interface GoodI extends Person {
  /**
   * Description of the good
   */
  description: string;
  /**
   * Material of the good
   */
  material: Material;
  /**
   * Weight of the good
   */
  weight: number;
  /**
   * Value of the good
   */
  crownValue: number;
  /**
   *  quantity of the good
   */
  stock: number;
}

/**
 * Interface that represents a Merchant
 * extends Person
 */
export interface MerchantI extends Person {
  /**
   * Type of the merchant
   */
  type: Type;
  /**
   * Description of the merchant
   */
  location: Ubication;
}

/**
 * Interface thata represents a Transaction
 */
export interface TransactionI extends Document {
  /**
   * Represents the consumer of the transaction
   */
  consumer: Types.ObjectId; 
  /**
   * Represents the user of the transaction
   */
  consumerType: string; 
  /**
   * Represents the merchant of the transaction
   */
  goods: {
    good: Types.ObjectId;
    quantity: number; 
  }[]; 
  /**
   * Represents the merchant of the transaction
   */
  date: Date; 
  /**
   * Represents the merchant of the transaction
   */
  purchaseType: TransactionType; 
  /**
   * Represents the merchant of the transaction
   */
  totalAmount: number; 
}