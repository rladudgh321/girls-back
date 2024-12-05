// tags.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service"; // PrismaService를 사용
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async tokenCheck(token: string) {
    const decoded = this.jwtService.verify(token.slice(7), {
      secret: this.configService.get("jwt").secret,
    });
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException("작성자를 찾을 수 없습니다.");
    }
  }

  async createTag(token: string, name: string) {
    // Prisma를 사용하여 태그 추가
    this.tokenCheck(token);

    const tag = await this.prisma.tag.create({
      data: {
        name,
      },
    });

    return tag; // 생성된 태그 객체 반환
  }

  async getTags() {
    // Prisma를 사용하여 모든 태그를 조회
    const tags = await this.prisma.tag.findMany({
      select: {
        id: true, // ID를 선택
        name: true, // 이름을 선택
      },
    });

    return tags; // 조회된 태그 목록 반환
  }

  // 태그 수정
  async updateTag(id: number, name: string, token: string) {
    // Prisma를 사용하여 태그 수정
    this.tokenCheck(token);
    const updatedTag = await this.prisma.tag.update({
      where: { id }, // ID로 찾기
      data: { name }, // 이름만 업데이트
    });

    // 만약 태그가 없다면 NotFoundException을 던짐
    if (!updatedTag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return updatedTag; // 수정된 태그 반환
  }

  // 태그 삭제
  async deleteTag({ id, token }: { id: number; token: string }) {
    this.tokenCheck(token);
    // Prisma를 사용하여 태그 삭제
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    // 태그가 존재하지 않으면 NotFoundException 던지기
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    // 태그 삭제
    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: "Tag deleted successfully" };
  }
}
