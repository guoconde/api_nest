import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { PrismaAttachmentMapper } from './prisma-attachment.mapper';

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      slug: Slug.create(raw.slug),
      title: raw.title,
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
