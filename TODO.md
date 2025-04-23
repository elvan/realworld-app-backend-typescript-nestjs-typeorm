# RealWorld API Implementation TODO List

## Project Setup
- [x] Initialize NestJS project
- [x] Setup TypeORM with MySQL
- [ ] Configure environment variables
- [ ] Create database connection configuration
- [ ] Set up JWT authentication
- [ ] Configure API documentation with Swagger

## API Endpoints Implementation

### User and Authentication
- [ ] Create User entity and DTOs
- [ ] Implement `/users/login` endpoint
- [ ] Implement `/users` registration endpoint
- [ ] Implement `/user` current user endpoint
- [ ] Implement user update endpoint

### Profiles
- [ ] Create Profile entity and DTOs
- [ ] Implement `/profiles/{username}` endpoint
- [ ] Implement follow user endpoint
- [ ] Implement unfollow user endpoint

### Articles
- [ ] Create Article entity and DTOs
- [ ] Implement `/articles/feed` endpoint
- [ ] Implement `/articles` list endpoint
- [ ] Implement article creation endpoint
- [ ] Implement single article endpoint
- [ ] Implement article update endpoint
- [ ] Implement article deletion endpoint

### Comments
- [ ] Create Comment entity and DTOs
- [ ] Implement get article comments endpoint
- [ ] Implement create comment endpoint
- [ ] Implement delete comment endpoint

### Favorites
- [ ] Create ArticleFavorite entity
- [ ] Implement favorite article endpoint
- [ ] Implement unfavorite article endpoint

### Tags
- [ ] Create Tag entity
- [ ] Implement get tags endpoint

## Testing
- [ ] Set up testing environment
- [ ] Write unit tests for services
- [ ] Write integration tests for controllers
- [ ] Create e2e tests for API endpoints

## Documentation
- [ ] Update README.md with project details
- [ ] Document API endpoints with Swagger
- [ ] Create installation and usage instructions

## Deployment
- [ ] Set up Docker containerization
- [ ] Configure CI/CD pipeline
- [ ] Deploy to a hosting service
