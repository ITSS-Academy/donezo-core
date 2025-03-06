import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Card } from '../../card/entities/card.entity';
import { Board } from '../../board/entities/board.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('int4')
  position: number;

  @OneToMany(() => Card, (card) => card.list)
  cards: Card[];

  @ManyToOne(() => Board, (board) => board.lists, {
    onDelete: 'CASCADE',
  })
  board: Board;
}
