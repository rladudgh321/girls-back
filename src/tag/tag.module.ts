import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  controllers: [TagController],
  providers: [TagService, PrismaService, JwtService],
})
export class TagModule {}
