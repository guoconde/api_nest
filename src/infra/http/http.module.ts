import { Module } from '@nestjs/common';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controler';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { EditQuestionController } from './controllers/edit-question.controler';
import { DeleteQuestionController } from './controllers/delete-question.controler';
import { AnswerQuestionController } from './controllers/answer-question.controler';
import { EditAnswerController } from './controllers/edit-answer.controler';
import { DeleteAnswerController } from './controllers/delete-answer.controler';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { CommentOnQuestionController } from './controllers/comment-on-question.controler';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
    DeleteAnswerUseCase,
    FetchQuestionAnswersUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
  ],
})
export class HttpModule {}
