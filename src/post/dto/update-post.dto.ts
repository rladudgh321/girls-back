import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePostReqDto {
  @ApiProperty({
    description: "The ID of the post to update",
    example: "d28d7b22-e088-47f4-9117-418fae79fa1d",
  })
  @IsInt()
  id: string; // 수정할 게시글의 ID

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
  content1?: string;

  @ApiProperty({
    description: "The new content of the post",
    example: "This is the updated content of the post.",
  })
  @IsString()
  @IsOptional() // 내용은 선택적으로 수정 가능
  content2?: string;

  @ApiProperty({
    description: "The new content of the post",
    example: "This is the updated content of the post.",
  })
  @IsString()
  @IsOptional() // 내용은 선택적으로 수정 가능
  content3: string;

  @ApiPropertyOptional({
    description: "List of tag IDs associated with the post",
    example: [1, 2],
  })
  @IsArray()
  @IsOptional()
  tags?: string[]; // 태그 ID 목록 (선택적)

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  @IsOptional()
  images1?: string[]; // 이미지 URL 목록 (선택적)

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  @IsOptional()
  images2?: string[]; // 이미지 URL 목록 (선택적)

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  @IsOptional()
  images3: string[];
}

export class UpdatePostResDto {
  @ApiProperty({
    description: "The updated post ID",
    example: "f47c3f62-9d43-47b0-9b64-0a1e9d1f15ef",
  })
  id: string;

  @ApiProperty({
    description: "The updated title of the post",
    example: "Updated Post Title",
  })
  title: string;

  @ApiProperty({
    description: "The updated content of the post",
    example: "This is the updated content of the post.",
  })
  content1?: string;

  @ApiProperty({
    description: "The updated content of the post",
    example: "This is the updated content of the post.",
  })
  content2?: string;

  @ApiProperty({
    description: "The updated content of the post",
    example: "This is the updated content of the post.",
  })
  content3: string;

  @ApiPropertyOptional({
    description: "List of updated tag IDs associated with the post",
    example: [1, 2],
  })
  @IsArray()
  tags: string[];

  @ApiPropertyOptional({
    description: "List of updated image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  images1?: string[];

  @ApiPropertyOptional({
    description: "List of updated image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  images2?: string[];

  @ApiProperty({
    description: "List of updated image URLs associated with the post",
    example: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  })
  @IsArray()
  images3: string[];
}
