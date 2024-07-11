import 'express-async-errors';

import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRouter from './routes/client.routes.js';
import projectRouter from './routes/project.routes.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(clientRouter);
app.use(projectRouter)

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
