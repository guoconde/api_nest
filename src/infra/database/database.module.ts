import { Module } from '@nestjs/common';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/reporitories/prisma-questions.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/reporitories/prisma-question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/reporitories/prisma-question-comments.repository';
import { PrismaAnswersRepository } from './prisma/reporitories/prisma-answers.repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/reporitories/prisma-answer-attachments.repository';
import { PrismaAnswerCommentsRepository } from './prisma/reporitories/prisma-answer-comments.repository';
import { PrismaStudentsRepository } from './prisma/reporitories/prisma-students.repository';
import { PrismaAttachmentsRespository } from './prisma/reporitories/prisma-attachments.repository';
import { PrismaNotificationsRepository } from './prisma/reporitories/prisma-notifications.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRespository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AnswersRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
