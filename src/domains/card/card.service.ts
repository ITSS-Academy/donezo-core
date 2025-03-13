import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { ChecklistItem } from '../checklist-item/entities/checklist-item.entity';
import { UpdateCardDto } from './dto/update-card.dto';
import { SupabaseService } from "../../services/supabase/supabase.service";

@Injectable()
export class CardService {
  constructor(private supabase: SupabaseService) {}

  async create(title: string, listId: string) {
    let lastPosition!: number;

    const { data, error } = await this.supabase.client
      .from('card')
      .select('position')
      .eq('listId', listId)
      .order('position', { ascending: false })
      .limit(1);

    lastPosition = data[0]?.position;

    if (lastPosition !== undefined) {
      lastPosition = lastPosition + 1;
    } else {
      lastPosition = 0;
    }

    const newCard = {
      title: title,
      description: '',
      listId: listId,
      position: lastPosition,
    };
    return this.supabase.client.from('card').insert(newCard).select();
  }

  async findAll() {}

  remove(id: string) {
    return this.supabase.client.from('card').delete().eq('id', id);
  }

  async updateCard(card: UpdateCardDto) {
    if (!card) {
      throw new BadRequestException('Title is required');
    }

    //update and get listId promise.all
    const promises = [
      this.supabase.client
        .from('card')
        .update({
          title: card.title,
          description: card.description,
          dueDate: card.dueDate,
        })
        .eq('id', card.id)
        .select(),
      this.supabase.client
        .from('card')
        .select('listId')
        .eq('id', card.id)
        .single(),
    ];

    let [data, listData] = await Promise.all(promises);

    if (data.error) {
      throw new BadRequestException(data.error.message);
    }

    if (listData.error) {
      throw new BadRequestException(listData.error.message);
    }

    return data.data[0];
  }

  async updateDescription(id: string, description: string) {
    if (!description) {
      throw new BadRequestException('Description is required');
    }
    const { data, error } = await this.supabase.client
      .from('card')
      .update({ description })
      .eq('id', id)
      .select();

    if (error) {
      throw new BadRequestException(error.message);
    }
    if (data.length == 0) {
      throw new BadRequestException('Card not found');
    }

    return data;
  }

  updatePosition(cards: UpdateCardDto[]) {
    if (!cards) {
      throw new BadRequestException('No cards provided');
    }

    const promises = cards.map((card, index) => {
      return this.supabase.client
        .from('card')
        .update({ position: index })
        .eq('id', card.id)
        .select();
    });

    return Promise.all(promises);
  }

  async addNewMember(cardId: string, userId: string, senderId: string) {
    const { data: exitingMemberData, error: exitingMemberDataError } =
      await this.supabase.client
        .from('user_cards')
        .select()
        .eq('card_id', cardId)
        .eq('user_id', userId);
    if (exitingMemberData.length > 0) {
      throw new BadRequestException('User already a member');
    }

    const newMember = {
      card_id: cardId,
      user_id: userId,
    };

    const { data, error } = await this.supabase.client
      .from('user_cards')
      .insert(newMember)
      .select();
    if (error) {
      throw new BadRequestException(error.message);
    }

    //get new member
    const { data: memberData, error: memberError } =
      await this.supabase.client
        .from('user')
        .select()
        .eq('id', userId)
        .single();

    if (memberError) {
      throw new BadRequestException(memberError.message);
    }

    //create notification

    return memberData;
  }

  async removeMember(cardId: string, userId: string, senderId: string) {
    const { data, error } = await this.supabase.client
      .from('user_cards')
      .delete()
      .eq('card_id', cardId)
      .eq('user_id', userId);
    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async findAllByUid(uid, offset: number, limit: number) {
    const newPage = offset + limit - 1;
    const { data: cards, error: fetchError } = await this.supabase.client
      .from('user_cards')
      .select('cardId')
      .eq('userId', uid)
      .order('createdAt', { ascending: false })
      .range(offset, newPage);

    if (fetchError) {
      throw new BadRequestException(fetchError.message);
    }

    if (!cards || cards.length === 0) {
      return [];
    }

    const promises = cards.map(async (card) => {
      const { data: cardData, error } = await this.supabase.client
        .from('card')
        .select()
        .eq('id', card.cardId)
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }
      return cardData;
    });

    const cardData = await Promise.all(promises);
    console.log(cardData);

    return cardData;
  }

  async findOne(id: string) {
    const { data: cardData, error: cardError } = await this.supabase.client
      .from('card')
      .select('id,title,description,dueDate')
      .eq('id', id)
      .single();

    if (cardError) {
      throw new BadRequestException(cardError.message);
    }

    const [
      { data: comments, error: commentError },
      { data: checklistItems, error: checklistItemError },
      { data: labels, error: labelError },
      { data: members, error: memberError },
      { data: attachments, error: attachmentError },
    ] = await Promise.all([
      this.supabase.client.from('comment').select().eq('cardId', id),
      this.supabase.client
        .from('checklist_item')
        .select()
        .eq('cardId', id)
        .order('is_completed', { ascending: true }),
      this.supabase.client
        .from('labels_cards')
        .select('boardLabelId')
        .eq('cardId', id),
      this.supabase.client
        .from('user_cards')
        .select('user_id')
        .eq('card_id', id),
      this.supabase.client.from('card_attachment').select().eq('cardId', id),
    ]);

    if (commentError) throw new BadRequestException(commentError.message);
    if (checklistItemError)
      throw new BadRequestException(checklistItemError.message);
    if (labelError) throw new BadRequestException(labelError.message);
    if (memberError) throw new BadRequestException(memberError.message);
    if (attachmentError) throw new BadRequestException(attachmentError.message);

    //get label and member
    const labelPromises = labels.map((label) => {
      return this.supabase.client
        .from('board_label')
        .select()
        .eq('id', label.boardLabelId)
        .single();
    });

    const memberPromises = members.map((member) => {
      return this.supabase.client
        .from('user')
        .select()
        .eq('id', member.user_id)
        .single();
    });

    let [labelData, memberData] = await Promise.all([
      Promise.all(labelPromises),
      Promise.all(memberPromises),
    ]);

    labelData = labelData.map((label) => label.data);
    memberData = memberData.map((member) => member.data);
    checklistItems.map((item) => {
      item.isCompleted = item.is_completed;
    });

    return {
      id: cardData.id,
      title: cardData.title,
      description: cardData.description,
      dueDate: cardData.dueDate,
      comments,
      checklistItems,
      labels: labelData,
      members: memberData,
      attachments,
    };
  }

  async filterCards(labelIds: string[], memberIds: string[], boardId: string) {
    const { data: listData, error: listError } = await this.supabase.client
      .from('list')
      .select('id')
      .eq('boardId', boardId);

    if (listError) {
      return [];
    }

    const listIds = listData.map((list) => list.id);
    if (listIds.length === 0) return [];

    let cardIdsFromLabels = new Set<string>();
    let cardIdsFromMembers = new Set<string>();

    if (labelIds.length > 0) {
      const { data: labelCards, error: labelError } =
        await this.supabase.client
          .from('labels_cards')
          .select('cardId, boardLabelId')
          .in('boardLabelId', labelIds);

      if (labelError) {
        return [];
      }

      const labelCardCount = new Map<string, number>();
      labelCards.forEach((card) => {
        labelCardCount.set(
          card.cardId,
          (labelCardCount.get(card.cardId) || 0) + 1,
        );
      });

      // Chỉ lấy những card có **tất cả** labelIds
      cardIdsFromLabels = new Set(
        [...labelCardCount.entries()]
          .filter(([_, count]) => count === labelIds.length)
          .map(([cardId]) => cardId),
      );
    }

    if (memberIds.length > 0) {
      const { data: memberCards, error: memberError } =
        await this.supabase.client
          .from('user_cards')
          .select('card_id, user_id')
          .in('user_id', memberIds);

      if (memberError) {
        return [];
      }

      const memberCardCount = new Map<string, number>();
      memberCards.forEach((card) => {
        memberCardCount.set(
          card.card_id,
          (memberCardCount.get(card.card_id) || 0) + 1,
        );
      });

      cardIdsFromMembers = new Set(
        [...memberCardCount.entries()]
          .filter(([_, count]) => count === memberIds.length)
          .map(([cardId]) => cardId),
      );
    }

    let finalCardIds: string[] = [];
    if (labelIds.length > 0 && memberIds.length > 0) {
      finalCardIds = [...cardIdsFromLabels].filter((id) =>
        cardIdsFromMembers.has(id),
      );
    } else if (labelIds.length > 0) {
      finalCardIds = [...cardIdsFromLabels];
    } else if (memberIds.length > 0) {
      finalCardIds = [...cardIdsFromMembers];
    }

    if (finalCardIds.length === 0) return [];

    // Truy vấn card dựa trên listId và finalCardIds
    const { data, error } = await this.supabase.client
      .from('card')
      .select('id')
      .in('id', finalCardIds)
      .in('listId', listIds);

    if (error) {
      return [];
    }

    return data;
  }

  async getCardByUser(uid: string){
    // Lấy tất cả các board của user
    const { data: boards, error: boardError } = await this.supabase.client
      .from('board')
      .select('id, name')
      .eq('ownerId', uid);

    if (boardError) {
      throw new BadRequestException(boardError.message);
    }

    if (!boards?.length) return []; // Không có board nào -> trả về []

    // Lấy tất cả danh sách (list) từ các board
    const listPromises = boards.map(async (board) => {
      const { data: lists, error: listError } = await this.supabase.client
        .from('list')
        .select('id')
        .eq('boardId', board.id);

      if (listError) {
        throw new BadRequestException(listError.message);
      }

      return lists?.map((list) => ({
        id: list.id,
        board: { id: board.id, name: board.name }, // Gán thông tin board vào list
      })) ?? [];
    });

    const listsData = (await Promise.all(listPromises)).flat(); // Flatten danh sách lists

    if (!listsData.length) return []; // Không có list nào -> trả về []

    // Lấy tất cả các card từ danh sách, kèm theo thông tin board
    const cardPromises = listsData.map(async ({ id: listId, board }) => {
      const { data: cards, error: cardError } = await this.supabase.client
        .from('card')
        .select('id, title, description, dueDate')
        .eq('listId', listId);

      if (cardError) {
        throw new BadRequestException(cardError.message);
      }

      return cards?.map((card) => ({
        ...card,
        board, // Gán thông tin board vào card
      })) ?? [];
    });

    const cardData = (await Promise.all(cardPromises)).flat(); // Flatten danh sách cards

    //get label data
    const labelPromises = cardData.map(async (card) => {
      const { data: labels, error } = await this.supabase.client
        .from('labels_cards')
        .select('boardLabelId')
        .eq('cardId', card.id);
      if (error) {
        throw new BadRequestException(error.message);
      }

      //get label data
      const promises = labels.map(async (label) => {
        const { data: labelData, error } = await this.supabase.client
          .from('board_label')
          .select()
          .eq('id', label.boardLabelId)
          .single();
        if (error) {
          throw new BadRequestException(error.message);
        }
        return labelData;
      });

      const labelData = await Promise.all(promises);

      return labelData;
    });

    const labelData = await Promise.all(labelPromises);

    const cardDataWithLabel = cardData.map((card, index) => {
      return {
        ...card,
        labels: labelData[index],
      };
    })

    return cardDataWithLabel;
  }

  async getBoardById(boardId: string) {
    const { data, error } = await this.supabase.client
      .from('board')
      .select()
      .eq('id', boardId)
      .single();
    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async getListIdById(listId: string) {
    const { data, error } = await this.supabase.client
      .from('list')
      .select('*')
      .eq('id', listId)
      .single();
    if (error) {
      throw new BadRequestException(error.message);
    }
    return data;
  }

  async getLaBelCards(cardId: string) {
    const { data, error } = await this.supabase.client
      .from('labels_cards')
      .select('boardLabelId')
      .eq('cardId', cardId);
    if (error) {
      throw new BadRequestException(error.message);
    }

    //get label data
    const promises = data.map(async (label) => {
      const { data: labelData, error } = await this.supabase.client
        .from('board_label')
        .select()
        .eq('id', label.boardLabelId)
        .single();
      if (error) {
        throw new BadRequestException(error.message);
      }
      return labelData;
    });

    const labelData = await Promise.all(promises);

    return labelData;
  }

  async getCommentsCount(cardId: string) {
    const { data, error } = await this.supabase.client
      .from('comment')
      .select('id', { count: 'exact' })
      .eq('cardId', cardId);
    if (error) {
      throw new BadRequestException(error.message);
    }

    return data.length;
  }

  async getChecklistItems(cardId: string) {
    const { data, error } = await this.supabase.client
      .from('checklist_item')
      .select('id, title, is_completed')
      .eq('cardId', cardId)
      .order('is_completed', { ascending: true });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return data.map((item) => {
      return {
        id: item.id,
        title: item.title,
        isCompleted: item.is_completed,
      };
    });
  }

  async getAssignedUsers(cardId: string) {
    const { data, error } = await this.supabase.client
      .from('user_cards')
      .select('user_id')
      .eq('card_id', cardId);
    if (error) {
      throw new BadRequestException(error.message);
    }

    //get user data
    const promises = data.map(async (user) => {
      const { data: userData, error } = await this.supabase.client
        .from('user')
        .select()
        .eq('id', user.user_id)
        .single();
      if (error) {
        throw new BadRequestException(error.message);
      }
      return userData;
    });

    const userData = await Promise.all(promises);

    return userData;
  }
}
