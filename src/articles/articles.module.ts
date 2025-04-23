import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, Comment, Tag]),
    UsersModule,
  ],
  controllers: [ArticlesController, CommentsController, TagsController],
  providers: [ArticlesService, CommentsService, TagsService],
  exports: [ArticlesService, CommentsService, TagsService],
})
export class ArticlesModule {}
