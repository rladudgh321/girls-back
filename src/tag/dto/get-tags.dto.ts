// dto/get-tags-res.dto.ts
import { IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetTagsResDto {
  @ApiProperty({
    description: "List of tags",
    type: [Object],
    example: [
      { id: "b35d742f-6507-4a4d-84ea-d4209921d013", name: "nestjs" },
      { id: "b35d742f-6507-4a4d-84ea-d4209921d015", name: "prisma" },
    ],
  })
  @IsArray()
  tags: { id: string; name: string }[]; // 태그 객체 목록 (ID와 이름 포함)
}
