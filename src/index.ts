// Entry point
import envs from './helpers/envs';
import app from './app';

app.listen(envs.PORT as number, 'localhost', () => {
  console.log(`Nodana API listening on port ${envs.PORT}`);
});
