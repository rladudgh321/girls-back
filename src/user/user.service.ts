import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

import { Role } from "./enum/role.enum";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async tokenCheck(token: string) {
    const decoded = this.jwtService.verify(token.slice(7), {
      secret: this.configService.get("jwt").secret,
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException("작성자를 찾을 수 없습니다.");
    }
  }

  async findAll(page: number, postsPerPage: number) {
    const user = await this.prismaService.user.findMany({
      skip: (page - 1) * postsPerPage,
      take: postsPerPage,
    });
    return user;
  }

  async getUserId(token: string) {
    const decoded = this.jwtService.verify(token.slice(7), {
      secret: this.configService.get("jwt").secret,
    });

    const user = await this.findOne(decoded.sub);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user;
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();

    return user;
  }

  async checkAdminUser(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    return user.role === Role.Admin;
  }
}
