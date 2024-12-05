import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"; // Swagger 관련 데코레이터
import { Transform } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
} from "class-validator";

export class GetPostsReqDto {
  @ApiPropertyOptional({
    description: "The page number for pagination",
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: "The number of posts per page",
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(10)
  postsPerPage: number = 10;

  @ApiPropertyOptional({
    description: "The tag to filter posts by",
    example: "nestjs",
  })
  @IsOptional()
  @IsString()
  tag: string = "";
}

export class GetPostsResDto {
  @ApiProperty({
    description: "The total count of posts matching the query",
    example: 100,
  })
  @IsInt()
  totalCount: number; // 총 게시물 수

  @ApiProperty({
    description: "The list of post IDs",
    example: [{ id: 1 }, { id: 2 }, { id: 3 }],
  })
  @IsArray()
  posts: {
    id: number;
    title: string;
    content?: string;
    tags: { id: number; name: string }[];
  }[]; // 게시물 ID의 배열
}
