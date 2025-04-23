import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Article } from '../../articles/entities/article.entity';
import { Comment } from '../../articles/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'user_follows',
    joinColumn: {
      name: 'follower_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followed_id',
      referencedColumnName: 'id',
    },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @ManyToMany(() => Article, (article) => article.favoritedBy)
  @JoinTable({
    name: 'article_favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
  })
  favoriteArticles: Article[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    const { password, ...userObject } = this;
    return userObject;
  }

  toProfileJSON(following = false) {
    return {
      username: this.username,
      bio: this.bio || '',
      image: this.image || '',
      following,
    };
  }

  toAuthJSON(token: string) {
    return {
      email: this.email,
      token,
      username: this.username,
      bio: this.bio || '',
      image: this.image || '',
    };
  }
}
