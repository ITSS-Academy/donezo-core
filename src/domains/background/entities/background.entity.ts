import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../board/entities/board.entity';

@Entity()
export class Background {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  color: string;

  @Column('text', { nullable: true })
  fileName?: string;

  @Column('text', { nullable: true })
  fileLocation: string;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('boolean', { default: true })
  isPredefined: boolean;
}
