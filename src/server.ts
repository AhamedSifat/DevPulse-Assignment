import app from './app';
import env from './config/env';
import initDb from './db';

const main = async () => {
  app.listen(env.PORT, () => {
    initDb();
    console.log(`Server is running on port ${env.PORT}`);
  });
};
main();
