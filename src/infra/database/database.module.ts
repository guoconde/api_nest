import { Module } from '@nestjs/common';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/reporitories/prisma-questions.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/reporitories/prisma-question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/reporitories/prisma-question-comments.repository';
import { PrismaAnswersRepository } from './prisma/reporitories/prisma-answers.repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/reporitories/prisma-answer-attachments.repository';
import { PrismaAnswerCommentsRepository } from './prisma/reporitories/prisma-answer-comments.repository';
import { PrismaStudentsRepository } from './prisma/reporitories/prisma-students.repository';

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
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule {}
