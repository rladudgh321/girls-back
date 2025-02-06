import { ApiProperty } from "@nestjs/swagger"; // Swagger 관련 데코레이터
import { IsArray, IsInt } from "class-validator";

export class GetPostIdsResDto {
  @ApiProperty({
    description: "Array of post IDs",
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        createdAt: "2025-01-22 09:25:53.912",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        createdAt: "2025-01-24 09:25:53.912",
      },
      {
        id: "e96b55c7-4b5a-4d2c-b557-23c7eaa1782a",
        createdAt: "2025-01-25 09:25:53.912",
      },
    ],
  })
  @IsArray()
  @IsInt({ each: true }) // 배열의 각 항목이 정수여야 함
  posts: { id: string; createdAt: Date }[]; // 게시물 ID만 포함한 배열
}
