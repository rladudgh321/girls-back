import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("girls API Board")
    .setDescription("간단하게 하자")
    .setVersion("0.0.1")
    .addTag("girls tag")

    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  // ValidationPipe 전역 적용
  app.useGlobalPipes(
    new ValidationPipe({
      // class-transformer 적용
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const stage = configService.get("STAGE");
  const port = 3065;
  console.info(`서버모드는 ${stage}이고 port는 ${port}`);

  await app.listen(port);
}
bootstrap();
