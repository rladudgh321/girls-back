import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePostReqDto {
  @ApiProperty({
    description: "The ID of the post to update",
    example: 1,
  })
  @IsInt()
  id: number; // 수정할 게시글의 ID

  @ApiProperty({
    description: "The new title of the post",
    example: "Updated Post Title",
  })
  @IsString()
  @IsOptional() // 제목은 선택적으로 수정 가능
  title?: string;

  @ApiProperty({
    description: "The new content of the post",
    example: "This is the updated content of the post.",
  })
  @IsString()
  @IsOptional() // 내용은 선택적으로 수정 가능
  content?: string;

  @ApiPropertyOptional({
    description: "List of tag IDs associated with the post",
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  tags?: number[]; // 태그 ID 목록 (선택적)

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  @IsOptional()
  images?: string[]; // 이미지 URL 목록 (선택적)
}

export class UpdatePostResDto {
  @ApiProperty({
    description: "The updated post ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "The updated title of the post",
    example: "Updated Post Title",
  })
  title: string;

  @ApiProperty({
    description: "The updated content of the post",
    example: "This is the updated content of the post.",
  })
  content: string;

  @ApiPropertyOptional({
    description: "List of updated tag IDs associated with the post",
    example: [1, 2],
  })
  @IsArray()
  tags: number[];

  @ApiPropertyOptional({
    description: "List of updated image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  images: string[];
}
