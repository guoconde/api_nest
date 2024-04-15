import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter';

@Controller('/questions/:slug')
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionsBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionsBySlug.execute({ slug });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { question } = result.value;

    return {
      question: QuestionDetailsPresenter.toHTTP(question),
    };
  }
}
