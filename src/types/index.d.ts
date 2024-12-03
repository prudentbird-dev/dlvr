import { IUser } from "./user.type";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
