const request = require('supertest');
const { app } = require('../index'); // Adjust path to your main app file if needed
const { blogsList } = require('../controller/post.controller'); // Adjust path to your controller if needed
const uuid = require('uuid');

// This block runs before each test to ensure a clean state
beforeEach(() => {
  blogsList.length = 0;
});

describe('Blog API', () => {
  // A valid post object to use in tests
  const validPostData = {
    title: 'Jest and Supertest are Awesome',
    content: 'This is a detailed post about how to write effective API tests.',
    authorEmail: 'test.author@example.com',
    tags: ['testing', 'nodejs']
  };

  // Test suite for POST /posts
  describe('POST /posts', () => {
    it('should create a new post with valid data and return 201', async () => {
      const response = await request(app)
        .post('/posts')
        .send(validPostData);

      // Assertions for a successful creation
      expect(response.statusCode).toBe(201); // 201 Created is a more standard response
      expect(response.body.message).toBe('Post created successfully');
      expect(response.body.post).toHaveProperty('postId');
      expect(response.body.post.title).toBe(validPostData.title);
      expect(blogsList.length).toBe(1);
    });

    it('should return a 422 validation error for an invalid email', async () => {
      const invalidPost = { ...validPostData, authorEmail: 'invalid-email' };
      
      const response = await request(app)
        .post('/posts')
        .send(invalidPost);
      
      // Assertions for a validation failure
      expect(response.statusCode).toBe(422);
      expect(response.body).toHaveProperty('errors');
      expect(blogsList.length).toBe(0); // Ensure the invalid post was not added
    });
  });

  // Test suite for GET /posts
  describe('GET /posts', () => {
    it('should return 204 No Content when there are no posts', async () => {
      const response = await request(app).get('/posts');
      expect(response.statusCode).toBe(204);
    });

    it('should return all posts when posts exist', async () => {
      // Manually add a post to the list for the test
      blogsList.push({ postId: uuid.v4(), ...validPostData });

      const response = await request(app).get('/posts');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].authorEmail).toBe(validPostData.authorEmail);
    });
  });

  // Test suite for GET /posts/:postId
  describe('GET /posts/:postId', () => {
    it('should return a single post by its ID', async () => {
      const post = { postId: uuid.v4(), ...validPostData };
      blogsList.push(post);
      
      const response = await request(app).get(`/posts/${post.postId}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.post.postId).toBe(post.postId);
      expect(response.body.post.title).toBe(post.title);
    });

    it('should return 404 if post is not found', async () => {
      const nonExistentId = uuid.v4();
      const response = await request(app).get(`/posts/${nonExistentId}`);
      expect(response.statusCode).toBe(404);
    });
  });

  // Test suite for PATCH /posts/:postId (Using PATCH for partial updates)
  describe('PATCH /posts/:postId', () => {
    it('should update an existing post with partial data and return 200', async () => {
      const post = { postId: uuid.v4(), ...validPostData };
      blogsList.push(post);

      const updateData = { title: 'An Updated Title' };

      const response = await request(app)
        .patch(`/posts/${post.postId}`) // Assuming you use PATCH for partial updates
        .send(updateData);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.post.title).toBe(updateData.title);
      expect(response.body.post.content).toBe(validPostData.content); // Other fields should be unchanged
    });

    it('should return 404 if trying to update a non-existent post', async () => {
      const response = await request(app)
        .patch(`/posts/${uuid.v4()}`)
        .send({ title: 'A New Title' });
      expect(response.statusCode).toBe(404);
    });
  });

  // Test suite for DELETE /posts/:postId
  describe('DELETE /posts/:postId', () => {
    it('should delete a post and return 204', async () => {
      const post = { postId: uuid.v4(), ...validPostData };
      blogsList.push(post);
      
      const response = await request(app).delete(`/posts/${post.postId}`);
      
      expect(response.statusCode).toBe(204); // 204 No Content is standard for delete
      expect(blogsList.length).toBe(0); // Ensure the post is gone from the list
    });

    it('should return 404 if trying to delete a non-existent post', async () => {
      const response = await request(app).delete(`/posts/${uuid.v4()}`);
      expect(response.statusCode).toBe(404);
    });
  });
});