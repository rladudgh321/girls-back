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
import * as fs from "fs";
import * as path from "path";

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync(path.join(process.cwd(), "private.key")), // 개인 키
  //   cert: fs.readFileSync(path.join(process.cwd(), "certificate.crt")), // 서버 인증서
  //   ca: fs.readFileSync(path.join(process.cwd(), "ca_bundle.crt")), // 인증서 체인
  // };
  // const app = await NestFactory.create(AppModule, { httpsOptions: null });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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

  const port = process.env.NODE_ENV === "production" ? 80 : 3065;
  console.info(`서버모드는 ${stage}이고 port는 ${port}`);

  await app.listen(port, "0.0.0.0");
}
bootstrap();
