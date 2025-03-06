import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../../card/entities/card.entity';

@Entity()
export class CardAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Card, (card) => card.cardAttachments, {
    onDelete: 'CASCADE',
  })
  card: Card;

  @Column('date', { default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @Column()
  fileUrl: string;

  @Column()
  fileName: string;
}
