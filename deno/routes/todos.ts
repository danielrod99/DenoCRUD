import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

router.get('/todos', async (ctx) => {
  const todos = await getDb().collection('todos').find();
  const transformTodos = todos.map((todo: { _id: { $oid: string }, text: string }) => {
    return { id: todo._id.$oid, text: todo.text }
  })
  ctx.response.body = { todos: transformTodos };
});

router.post('/todos', async (ctx) => {
  const data = await ctx.request.body();
  const info = await data.value;
  const newTodo: Todo = {
    text: info.text,
  };

  const id = await getDb().collection('todos').insertOne(newTodo)
  newTodo.id = id.$oid;
  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;
  const data = await ctx.request.body() || {};
  const info = await data.value;
  await getDb().collection('todos').updateOne({ _id: tid }, { $set: { text: info.text } });
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;
  await getDb().collection().deleteOne({ _id: tid });
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
