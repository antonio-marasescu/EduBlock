import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

export enum EduUserRoles {
    USER = 'User',
    ADMIN = 'Admin'
}

@Entity()
export class EduUserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column('enum', {name: 'edu_user_role', enum: EduUserRoles})
    role: EduUserRoles;
}
