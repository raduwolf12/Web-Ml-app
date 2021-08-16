import AuthController from "./controller/AuthController";
import { TableItemController } from "./controller/TableItemController";
import {UserController} from "./controller/UserController";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
},{
    method: "post",
    route: "/login",
    controller: AuthController,
    action: "login"
},{
    method: "get",
    route: "/login/:email/:password",
    controller: AuthController,
    action: "one"
},{
    method: "get",
    route: "/infoT",
    controller: TableItemController,
    action: "all"
},{
    method: "post",
    route: "/evaluate",
    controller: TableItemController,
    action: "eval"
},{
    method: "get",
    route: "/train",
    controller: TableItemController,
    action: "train"
}];