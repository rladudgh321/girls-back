import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as basicAuth from "express-basic-auth";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://127.0.0.1:3000",
      "https://www.sarangirls.kro.kr",
      "https://saranggirls.kro.kr",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  });

  const configService = app.get(ConfigService);

  const stage = configService.get("STAGE");
  const SWAGGER_ENVS = ["development", "test"];
  if (SWAGGER_ENVS.includes(stage)) {
    app.use(
      ["/api", "/api-json"],
      basicAuth({
        challenge: true,
        users: {
          [configService.get("swagger.user")]:
            configService.get("swagger.password"),
        },
      }),
    );
    const config = new DocumentBuilder()
      .setTitle("vlog API board")
      .setDescription("vlog 간단하게 하자")
      .setVersion("0.0.1")
      .addTag("vlog tag")
      .addBearerAuth()

      .build();
    const document = SwaggerModule.createDocument(app, config);
    const swaggerCustomoptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup("api", app, document, swaggerCustomoptions);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = 3065;
  console.info(`서버모드는 ${stage}이고 port는 ${port}`);
  await app.listen(port, "0.0.0.0");
}
bootstrap();
