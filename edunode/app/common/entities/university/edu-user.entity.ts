import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class EduUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;
}
