import { OpaqueTokenContract } from "@ioc:Adonis/Addons/Auth";
import User from "App/Models/User";

export default interface {
  token: OpaqueTokenContract<User>,
  user: User
}
