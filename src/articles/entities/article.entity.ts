import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, BeforeInsert, BeforeUpdate } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';
import * as slugify from 'slugify';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column('text')
  body: string;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.favoriteArticles)
  favoritedBy: User[];

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (!this.slug || this.slug === '') {
      this.slug = (slugify as any)(this.title, { lower: true }) + 
                 '-' + 
                 ((Math.random() * Math.pow(36, 6) | 0).toString(36));
    }
  }

  toJSON() {
    return {
      ...this,
      tagList: this.tags?.map(tag => tag.name) || [],
    };
  }
}
