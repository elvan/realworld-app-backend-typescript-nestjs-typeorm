# RealWorld API Implementation TODO List

## Project Setup
- [x] Initialize NestJS project
- [x] Setup TypeORM with MySQL
- [x] Configure environment variables
- [x] Create database connection configuration
- [x] Set up JWT authentication
- [x] Configure API documentation with Swagger

## API Endpoints Implementation

### User and Authentication
- [x] Create User entity and DTOs
- [x] Implement `/users/login` endpoint
- [x] Implement `/users` registration endpoint
- [x] Implement `/user` current user endpoint
- [x] Implement user update endpoint

### Profiles
- [x] Create Profile entity and DTOs
- [x] Implement `/profiles/{username}` endpoint
- [x] Implement follow user endpoint
- [x] Implement unfollow user endpoint

### Articles
- [x] Create Article entity and DTOs
- [x] Implement `/articles/feed` endpoint
- [x] Implement `/articles` list endpoint
- [x] Implement article creation endpoint
- [x] Implement single article endpoint
- [x] Implement article update endpoint
- [x] Implement article deletion endpoint

### Comments
- [x] Create Comment entity and DTOs
- [x] Implement get article comments endpoint
- [x] Implement create comment endpoint
- [x] Implement delete comment endpoint

### Favorites
- [x] Create ArticleFavorite entity
- [x] Implement favorite article endpoint
- [x] Implement unfavorite article endpoint

### Tags
- [x] Create Tag entity
- [x] Implement get tags endpoint

## Testing
- [ ] Set up testing environment
- [ ] Write unit tests for services
- [ ] Write integration tests for controllers
- [ ] Create e2e tests for API endpoints

## Documentation
- [x] Update README.md with project details
- [x] Document API endpoints with Swagger
- [x] Create installation and usage instructions
