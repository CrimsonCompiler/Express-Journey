const request = require('supertest');
const { app } = require('../main.js');
const { todosList } = require('../controller/todo.controller.js');
const uuid = require('uuid');

// This block runs before each test in this file
beforeEach(() => {
  // Reset the todosList to an empty array before each test run
  // This ensures that tests are "isolated" and one test doesn't affect another
  todosList.length = 0;
});

describe('Todo API', () => {

  // Test suite for POST /todos
  describe('POST /todos', () => {
    it('should create a new todo with valid data and return 201', async () => {
      const newTodo = {
        title: 'Learn API Testing',
        description: 'Use Jest and Supertest correctly',
        status: 'pending',
      };

      const response = await request(app)
        .post('/todos')
        .send(newTodo);

      // Assertions to check if the request was successful
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe('Todo added successfully');
      expect(response.body.todo).toHaveProperty('id');
      expect(response.body.todo.title).toBe(newTodo.title);
      expect(todosList.length).toBe(1);
    });

    it('should return a 422 validation error for a title that is too short', async () => {
      const invalidTodo = {
        title: 'Short',
        description: 'This title will fail validation',
        status: 'pending',
      };

      const response = await request(app)
        .post('/todos')
        .send(invalidTodo);

      // Assertions to check if validation failed as expected
      expect(response.statusCode).toBe(422);
      expect(response.body).toHaveProperty('errors');
      expect(todosList.length).toBe(0); // Ensure nothing was added to the list
    });
  });

  // Test suite for GET /todos
  describe('GET /todos', () => {
    it('should return an empty array when no todos exist', async () => {
      const response = await request(app).get('/todos');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]); // Expect an empty array
    });

    it('should return an array with all todos', async () => {
      // First, add a todo directly to the list for this test
      const todo = { id: uuid.v4(), title: 'My First Test Todo', description: 'desc', status: 'pending' };
      todosList.push(todo);

      const response = await request(app).get('/todos');
      
      // Assertions to check if the correct data is returned
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('My First Test Todo');
    });
  });

  // Test suite for PATCH /todos/:id
  describe('PATCH /todos/:id', () => {
    it('should update an existing todo and return 200', async () => {
      // First, create a todo to update
      const todo = { id: uuid.v4(), title: 'Todo to be updated', description: 'Initial description', status: 'pending' };
      todosList.push(todo);

      const updateData = { status: 'completed' };

      const response = await request(app)
        .patch(`/todos/${todo.id}`)
        .send(updateData);
      
      // Assertions for a successful update
      expect(response.statusCode).toBe(200);
      expect(response.body.todo.status).toBe('completed');
      expect(response.body.todo.title).toBe(todo.title); // Title should remain unchanged
      expect(todosList[0].status).toBe('completed'); // Check the actual array
    });

    it('should return 404 for a non-existent todo ID', async () => {
      const nonExistentId = uuid.v4();
      const response = await request(app)
        .patch(`/todos/${nonExistentId}`)
        .send({ status: 'completed' });
      
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Todo not found');
    });

    it('should return 422 for invalid update data (e.g., wrong status)', async () => {
      const todo = { id: uuid.v4(), title: 'Another todo item', description: '...', status: 'pending' };
      todosList.push(todo);

      const invalidUpdate = { status: 'invalid_status' }; // This status is not in the enum

      const response = await request(app)
        .patch(`/todos/${todo.id}`)
        .send(invalidUpdate);

      expect(response.statusCode).toBe(422);
      expect(response.body).toHaveProperty('errors');
    });
  });

});