import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PrismaService } from "src/prisma/prisma.service";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "./multer.config";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PrismaService, JwtService, ConfigService],
})
export class PostModule {}
