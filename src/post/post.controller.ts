import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseFilePipeBuilder,
  HttpStatus,
  UseInterceptors,
  Headers,
  UploadedFiles,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostReqDto, CreatePostResponseDto } from "./dto/create-post.dto";
import { GetPostReqDto, GetPostResDto } from "./dto/get-post.dto";
import { GetPostsReqDto, GetPostsResDto } from "./dto/get-posts.dto";
import { GetPostIdsResDto } from "./dto/get-posts-ids.dto";
import {
  ApiParam,
  ApiTags,
  ApiExtraModels,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { UpdatePostReqDto, UpdatePostResDto } from "./dto/update-post.dto";
import {
  ApiGetResponse,
  ApiPostResponse,
} from "src/common/decorator/swagger.decorator";
import { Public } from "src/common/decorator/public.decorator";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@ApiTags("post")
@ApiExtraModels(
  GetPostIdsResDto,
  CreatePostResponseDto,
  GetPostsResDto,
  GetPostResDto,
  UpdatePostResDto,
)
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "image1" },
      { name: "image2" },
      { name: "image3" },
    ]),
  )
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image1: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
        image2: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
        image3: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @Post("upload")
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //   fileType: /(jpg|jpeg|png|webp|gif)$/, // 허용되는 이미지 파일 확장자
        // })
        // .addMaxSizeValidator({
        //   maxSize: 10 * 1024 * 1024, // 최대 파일 크기 10MB
        // })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: {
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
      image3?: Express.Multer.File[];
    },
  ) {
    const validFiles = {
      image1: files.image1 || [],
      image2: files.image2 || [],
      image3: files.image3 || [],
    };
    // 이미지 처리 로직
    return this.postService.uploadImages(validFiles);
  }

  @Public()
  @ApiBearerAuth()
  @ApiGetResponse(GetPostIdsResDto)
  @Get("/all")
  async getPostIds(): Promise<GetPostIdsResDto> {
    const posts = await this.postService.getAllPostIds();
    return {
      posts,
    };
  }

  @ApiBearerAuth()
  @ApiPostResponse(CreatePostResponseDto)
  @Post()
  async createPost(
    @Body()
    {
      title,
      content1,
      content2,
      content3,
      tags,
      images1,
      images2,
      images3,
    }: CreatePostReqDto,
    @Headers("authorization") token: string,
  ): Promise<CreatePostResponseDto> {
    const newPost = await this.postService.createPost(
      title,
      tags,
      images1,
      images2,
      images3,
      token,
      content3,
      content1,
      content2,
    );
    return {
      id: newPost.id,
      title: newPost.title,
      content1: newPost.content1,
      content2: newPost.content2,
      content3: newPost.content3,
      tags: newPost.postTags,
      images1: newPost.images1,
      images2: newPost.images2,
      images3: newPost.images3,
    };
  }

  @Public()
  @ApiBearerAuth()
  @ApiGetResponse(GetPostsResDto)
  @Get("/")
  async getPosts(
    @Query() { page, postsPerPage, tag }: GetPostsReqDto, // 쿼리 파라미터를 GetPostsReqDto로 받기
  ): Promise<any> {
    // 게시글 데이터를 가져오는 서비스 호출
    const result = await this.postService.getPosts(page, postsPerPage, tag);
    // 응답 형식에 맞게 반환
    return {
      totalCount: result.totalCount,
      posts: result.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content1: post.content1,
        content2: post.content2,
        content3: post.content3,
        tags: post.tags,
      })),
    };
  }

  @Public()
  @ApiBearerAuth()
  @ApiGetResponse(GetPostResDto)
  @Get(":id")
  async getPost(@Param() { id }: GetPostReqDto): Promise<GetPostResDto> {
    const postData = await this.postService.getPostById(id);
    // GetPostResDto 형식으로 응답 데이터를 반환
    return {
      id: postData.id,
      title: postData.title,
      content1: postData.content1,
      content2: postData.content2,
      content3: postData.content3,
      tags: postData.tags,
      images1: postData.images1,
      images2: postData.images2,
      images3: postData.images3,
    };
  }

  @ApiBearerAuth()
  @ApiPostResponse(UpdatePostResDto)
  @Patch(":id")
  async updatePost(
    @Param("id") id: string, // :id로부터 파라미터 받기
    @Body()
    {
      title,
      content1,
      content2,
      content3,
      tags,
      images1,
      images2,
      images3,
    }: UpdatePostReqDto, // 수정할 데이터 받기
  ): Promise<UpdatePostResDto> {
    const updatedPost = await this.postService.updatePost(
      id,
      title,
      content1,
      content2,
      content3,
      tags,
      images1,
      images2,
      images3,
    );
    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content1: updatedPost.content1,
      content2: updatedPost.content2,
      content3: updatedPost.content3,
      tags: updatedPost.tags,
      images1: updatedPost.images1,
      images2: updatedPost.images2,
      images3: updatedPost.images3,
    };
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiParam({
    name: "id",
    description: "The ID of the post to delete",
    example: 1,
  })
  async deletePost(
    @Param("id") id: string,
    @Headers("authorization") token: string,
  ) {
    const result = await this.postService.deletePost(id, token);
    return result; // 삭제 성공 메시지 반환
  }
}
