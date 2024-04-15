import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  // eslint-disable-next-line no-console
  await app.listen(port, () => console.log(`Server is running on port ${port}`));
}
bootstrap();
