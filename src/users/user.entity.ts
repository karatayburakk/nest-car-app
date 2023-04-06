import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`new user is inserted with id ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User is updated with id ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User is deleted with id ${this.id}`);
  }
}
