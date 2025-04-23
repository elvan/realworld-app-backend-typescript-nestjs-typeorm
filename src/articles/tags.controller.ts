import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { TagsResponseDto } from './dto/tag-response.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({
    status: 200,
    description: 'Return all tags.',
    type: TagsResponseDto,
  })
  async findAll(): Promise<TagsResponseDto> {
    return this.tagsService.findAll();
  }
}
