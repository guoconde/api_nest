import { Body, ConflictException, Controller, Post, UseGuards } from '@nestjs/common';
import { createSlug } from 'src/utils/create-slug.util';
import { z } from 'zod';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '../pipes/zod-validations.pipe';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type BodyRequest = z.infer<typeof createQuestionBodySchema>;

const validationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(@Body(validationPipe) body: BodyRequest, @CurrentUser() user: UserPayload) {
    const { title, content } = body;

    const slug = createSlug(title);

    const existingQuestion = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (existingQuestion) {
      throw new ConflictException('Question already exists');
    }

    const question = await this.prisma.question.create({
      data: {
        title,
        slug,
        content,
        authorId: user.sub,
      },
    });

    return {
      question,
    };
  }
}
