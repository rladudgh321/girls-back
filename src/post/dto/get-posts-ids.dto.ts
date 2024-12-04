import { ApiProperty } from "@nestjs/swagger"; // Swagger 관련 데코레이터
import { IsArray, IsInt } from "class-validator";

export class GetPostIdsResDto {
  @ApiProperty({
    description: "Array of post IDs",
    example: [{ id: 1 }, { id: 2 }, { id: 3 }],
  })
  @IsArray()
  @IsInt({ each: true }) // 배열의 각 항목이 정수여야 함
  posts: { id: number }[]; // 게시물 ID만 포함한 배열
}
