import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { ZodValidationPipe } from '../pipes/zod-validations.pipe';

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type BodyRequest = z.infer<typeof editQuestionBodySchema>;

const validationPipe = new ZodValidationPipe(editQuestionBodySchema);

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(validationPipe) body: BodyRequest,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
