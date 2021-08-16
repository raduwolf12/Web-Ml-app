import { NextFunction,Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {

  private repo = getRepository(User);

  async one(request: Request, response: Response,next: NextFunction ) {
    console.log('login')
    let  email = request.params.email;
    let  password =request.params.password;
    console.log(email)
    if (!(email && password)) {
      response.status(400).send();
    }

    let user: User;
    try {
      user = await this.repo.findOneOrFail({ where: { email, password } });

      if(user==null)
      {
        response.status(400).send();
      }
      console.log(user)
    } catch (error) {
      response.status(400).send();
    }
     //Check if encrypted password match
    //  if (!user.checkValidPass(password)) {
    //   response.status(401).send();
    //   return;
    // }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: "12h" }
    );

    //Send the jwt in the response
    response.send({token});
}


  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    console.log('Ceva')
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.status(401).send();
    }

    //Check if encrypted password match
    if (!user.checkValidPass(password)) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "12h" }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if old password matchs
    if (!user.checkValidPass(oldPassword)) {
      res.status(401).send();
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;