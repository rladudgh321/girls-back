import { Module, Logger } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostModule } from "./post/post.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { TagModule } from "./tag/tag.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import jwtConfig from "./config/jwt.config";
import { JwtService } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"), // 업로드된 파일이 저장될 경로
      serveRoot: "/uploads/", // 접근할 URL 경로
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    UserModule,
    AuthModule,
    PostModule,
    TagModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
    Logger,
  ],
})
export class AppModule {}
