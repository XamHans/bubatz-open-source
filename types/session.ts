import { type DefaultSession } from "next-auth";
import { IUserTypes } from "./user";

declare module "next-auth" {
  // Augmented the User interface with the properties from the database
  interface Session {
    user: {
      role: IUserTypes;
    } & DefaultSession["user"];
  }
}
