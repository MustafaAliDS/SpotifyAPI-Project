import express, { Application } from "express";
import { loginRouter } from './routes/login'

import * as dotenv from 'dotenv'
dotenv.config({path: '.env'});
export const { PORT,CLIENT_ID,CLIENT_SECERET } = process.env;


export const server: Application = express();
server.use('/login', loginRouter)


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
