/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Comment } from '@/domain/forum/enterprise/entities/comment';

export class CommentPresenter {
  static toHTTP(
    questionComment: Comment<any> & { questionId?: UniqueEntityID; answerId?: UniqueEntityID },
  ) {
    return {
      id: questionComment.id.toString(),
      questionId: questionComment.questionId?.toString() ?? null,
      answerId: questionComment.answerId?.toString() ?? null,
      authorId: questionComment.authorId.toString(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
