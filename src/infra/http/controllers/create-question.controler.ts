import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
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
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body(validationPipe) body: BodyRequest, @CurrentUser() user: UserPayload) {
    const { title, content } = body;
    const userId = user.sub;

    const question = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });

    return {
      question,
    };
  }
}
