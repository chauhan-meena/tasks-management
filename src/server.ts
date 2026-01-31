import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { TaskRoute } from '@routes/tasks.route';

const app = new App([
  new AuthRoute(),
  new TaskRoute(),
]);

app.listen();
