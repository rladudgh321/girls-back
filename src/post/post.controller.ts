import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostReqDto, CreatePostResponseDto } from "./dto/create-post.dto";
import { GetPostReqDto, GetPostResDto } from "./dto/get-post.dto";
import { GetPostsReqDto, GetPostsResDto } from "./dto/get-posts.dto";
import { GetPostIdsResDto } from "./dto/get-posts-ids.dto";
import { ApiParam, ApiTags, ApiExtraModels } from "@nestjs/swagger";
import { UpdatePostReqDto, UpdatePostResDto } from "./dto/update-post.dto";
import {
  ApiGetResponse,
  ApiPostResponse,
} from "src/common/decorator/swagger.decorator";

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

  @ApiGetResponse(GetPostIdsResDto)
  @Get("/all")
  async getPostIds(): Promise<GetPostIdsResDto> {
    const posts = await this.postService.getAllPostIds();
    return {
      posts,
    };
  }

  @ApiPostResponse(CreatePostResponseDto)
  @Post()
  async createPost(
    @Body() { title, content, tags, images }: CreatePostReqDto,
  ): Promise<CreatePostResponseDto> {
    const newPost = await this.postService.createPost(
      title,
      content,
      tags,
      images,
    );
    return {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      tags: newPost.postTags["tag"],
      images: newPost.images["images"],
    };
  }

  @ApiGetResponse(GetPostsResDto)
  @Get("/")
  async getPosts(
    @Query() { page, postsPerPage, tag }: GetPostsReqDto, // 쿼리 파라미터를 GetPostsReqDto로 받기
  ): Promise<GetPostsResDto> {
    // 게시글 데이터를 가져오는 서비스 호출
    const result = await this.postService.getPosts(page, postsPerPage, tag);

    // 응답 형식에 맞게 반환
    return {
      totalCount: result.totalCount,
      posts: result.posts.map((post) => ({ id: post.id })), // id만 포함
    };
  }

  @ApiGetResponse(GetPostResDto)
  @Get(":id")
  async getPost(@Param() { id }: GetPostReqDto): Promise<GetPostResDto> {
    const postData = await this.postService.getPostById(id);

    // GetPostResDto 형식으로 응답 데이터를 반환
    return {
      id: postData.id,
      title: postData.title,
      date: postData.date,
      tags: postData.tags,
      images: postData.images,
    };
  }

  @ApiPostResponse(UpdatePostResDto)
  @Patch(":id")
  async updatePost(
    @Param("id") id: number, // :id로부터 파라미터 받기
    @Body() { title, content, tags, images }: UpdatePostReqDto, // 수정할 데이터 받기
  ): Promise<UpdatePostResDto> {
    const updatedPost = await this.postService.updatePost(
      id,
      title,
      content,
      tags,
      images,
    );
    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      tags: updatedPost.tags,
      images: updatedPost.images,
    };
  }

  @Delete(":id")
  @ApiParam({
    name: "id",
    description: "The ID of the post to delete",
    example: 1,
  })
  async deletePost(@Param("id") id: number) {
    const result = await this.postService.deletePost(id);
    return result; // 삭제 성공 메시지 반환
  }
}