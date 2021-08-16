import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class TableItem{

    @PrimaryGeneratedColumn()
    positionId:number;

    @Column()
    imageName: string;

    @Column()
    size:number;
    
    @Column()
    recognitionResult: string;
    
    @Column()
    downloadLink: string;

}