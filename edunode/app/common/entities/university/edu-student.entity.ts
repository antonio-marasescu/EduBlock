import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity()
export class EduStudentEntity {
    @PrimaryColumn()
    publicKey: string;

    @Column()
    fullName: string;

    @Column()
    groupId: string;

    @Column()
    faculty: string;
}
