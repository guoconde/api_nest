import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './prisma/reporitories/prisma-questions.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/reporitories/prisma-question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/reporitories/prisma-question-comments.repository';
import { PrismaAnswersRepository } from './prisma/reporitories/prisma-answers.repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/reporitories/prisma-answer-attachments.repository';
import { PrismaAnswerCommentsRepository } from './prisma/reporitories/prisma-answer-comments.repository';

const handleImports = [
  PrismaService,
  PrismaQuestionsRepository,
  PrismaQuestionAttachmentsRepository,
  PrismaQuestionCommentsRepository,
  PrismaAnswersRepository,
  PrismaAnswerAttachmentsRepository,
  PrismaAnswerCommentsRepository,
];

@Module({
  providers: [...handleImports],
  exports: [...handleImports],
})
export class DatabaseModule {}
