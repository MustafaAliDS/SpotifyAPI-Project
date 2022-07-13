import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { loginRouter } from '../routes/index';
import * as dotenv from 'dotenv';
import { RegisterRoutes } from '../routes/routes';
import morgan from 'morgan';

dotenv.config({ path: '.env' });

export const server: Application = express();

server.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    swaggerUi.generateHTML(await import('../../swagger.json')),
  );
});

server.use(morgan('combined'));

RegisterRoutes(server);

server.use(loginRouter);
