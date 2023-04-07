import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
