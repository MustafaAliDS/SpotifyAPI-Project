import express, { Application } from "express";
import { loginRouter } from '../routes/index'
import * as dotenv from 'dotenv'

dotenv.config({path: '.env'});

export const { PORT } = process.env;
export const server: Application = express();


server.use(loginRouter)


if (process.env['NODE_ENV'] !== 'test') {
  if(PORT === undefined){
    throw new Error('PORT is undefined');
  }
  else {
    server.listen(PORT, () => {
    console.log(`Working on port ${PORT}`);
  });
}
}
