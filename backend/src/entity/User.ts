import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @Column()
    age: number;
    
    @Column()
    email: string;
    
    @Column()
    password: string;

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
      }
    
      checkValidPass(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
      }

}
