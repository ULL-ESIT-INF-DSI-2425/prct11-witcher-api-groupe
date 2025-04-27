import { Race, Ubication, Material, Type } from "./enum.js";

/**
 * Interface that represents a Person 
 */
export interface Person {
  /**
   * Unique identifier for the person
   */
  id: number;
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