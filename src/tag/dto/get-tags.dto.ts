// dto/get-tags-res.dto.ts
import { IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetTagsResDto {
  @ApiProperty({
    description: "List of tags",
    type: [Object],
    example: [
      { id: 1, name: "nestjs" },
      { id: 2, name: "prisma" },
    ],
  })
  @IsArray()
  tags: { id: number; name: string }[]; // 태그 객체 목록 (ID와 이름 포함)
}
