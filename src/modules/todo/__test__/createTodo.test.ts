import { describe, it, vi, expect } from 'vitest';
import { createServer } from '../../../../src/utils/createServer';
import * as TodoService from '../todo.service';
import { nanoid } from 'nanoid';

describe('POST "api/todos" route', () => {
  it('should call the createTodo service', async () => {
    const createTodoSpy = vi.spyOn(TodoService, 'createTodo');

    expect(createTodoSpy.getMockName()).toEqual('createTodo');

    const todo = {
      _id: 'mockId',
      title: 'mockTitle',
      shortId: nanoid(),
      checked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    createTodoSpy.mockResolvedValue(todo);

    const server = await createServer();

    await server.ready();

    const payload = {
      title: 'This is a test todo',
    };

    const response = await server.inject({
      method: 'POST',
      url: 'api/todos',
      payload,
    });

    expect(response.json()).toEqual(todo);

    expect(createTodoSpy).toHaveBeenCalledWith(payload);
  });
});
