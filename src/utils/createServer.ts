import fastify from 'fastify';
import { todoRoute } from '../modules/todo/todo.route';
import { version } from '../../package.json';
import swagger from '@fastify/swagger';

export async function createServer() {
  const app = fastify();

  app.register(swagger, {
    routePrefix: '/docs',
    swagger: {
      tags: [
        {
          name: 'todo',
        },
      ],
      info: {
        title: 'Todo',
        description: 'A simple todo app',
        version,
      },
    },
    staticCSP: true,
    exposeRoute: true,
  });

  app.register(todoRoute, { prefix: '/api/todos' });

  return app;
}
