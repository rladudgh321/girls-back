import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostModule } from "./post/post.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { TagModule } from "./tag/tag.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
