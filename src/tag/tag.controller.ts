// tags.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagReqDto, CreateTagResDto } from "./dto/create-tag.dto";
import { GetTagsResDto } from "./dto/get-tags.dto";
import { UpdateTagReqDto, UpdateTagResDto } from "./dto/update-tag.dto";
import {
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ApiGetResponse,
  ApiPostResponse,
} from "src/common/decorator/swagger.decorator";

@ApiTags("tag")
@ApiExtraModels(CreateTagResDto, GetTagsResDto, UpdateTagResDto)
@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiPostResponse(CreateTagResDto)
  @Post()
  async create(@Body() { name }: CreateTagReqDto): Promise<CreateTagResDto> {
    const tag = await this.tagService.createTag(name);
    return tag; // 생성된 태그 반환
  }

  // GET /tags : 모든 태그를 조회
  @ApiGetResponse(GetTagsResDto)
  @Get()
  async getTags(): Promise<GetTagsResDto> {
    const tags = await this.tagService.getTags(); // 태그 목록 조회
    return { tags }; // GetTagsResDto 형태로 반환
  }

  // 태그 수정
  @ApiParam({
    name: "id",
    description: "The ID of the tag to update",
    example: 1,
  }) // Swagger에서 파라미터 id에 대한 설명 추가
  @ApiPostResponse(UpdateTagResDto)
  @Patch(":id")
  async updateTag(
    @Param("id") id: number,
    @Body() { name }: UpdateTagReqDto,
  ): Promise<UpdateTagResDto> {
    const updatedTag = await this.tagService.updateTag(id, name);
    return { id, name: updatedTag.name };
  }

  @ApiParam({
    name: "id",
    description: "The ID of the tag to delete",
    example: 1,
  }) // Swagger에서 파라미터 id에 대한 설명 추가
  @ApiResponse({
    status: 200,
    description: "The tag has been successfully deleted.",
  })
  @ApiResponse({
    status: 404,
    description: "Tag not found",
  })
  @Delete(":id")
  async deleteTag(@Param("id") id: number): Promise<void> {
    await this.tagService.deleteTag(id); // 서비스에서 태그 삭제 호출
  }
}
