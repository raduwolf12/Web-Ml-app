import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import { TableItem } from "./entity/TableItem";

createConnection().then(async connection => {

    // create express app

    var express = require('express')
    var cors = require('cors')
    var app = express()

    app.use(cors())

    app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
    })

    app.listen(80, function () {
    console.log('CORS-enabled web server listening on port 80')
    })

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });
    app.use(bodyParser.json());
    const fileUpload = require('express-fileupload')
    app.use(fileUpload({
        useTempFiles : false,
        tempFileDir : '/tmp/'
    }));

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });
    

    // setup express app here
    // ...

    // start express server
    // app.use(cors());
    app.listen(3000);

    // insert new users for test
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Timber",
    //     lastName: "Saw",
    //     username: "TS",
    //     age: 27,
    //     email: "tim@gmail.com",
    //     password: "pass"
    // }));
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Phantom",
    //     lastName: "Assassin",
    //     username: "PA",
    //     age: 24,
    //     email: "assasin@yahoo.com",
    //     password: "pass"
    // }));

    // await connection.manager.save(connection.manager.create(TableItem, {
    //         imageName: "apple",
    //         size: 12,
    //         recognitionResult: "idk",
    //         downloadLink: "www.google.com"
    //     }));

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
