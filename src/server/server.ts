import express, { Application } from "express";
import { loginRouter } from '../routes/index'
import * as dotenv from 'dotenv'
import { RegisterRoutes } from "../routes/routes";

dotenv.config({path: '.env'});

export const server: Application = express();

RegisterRoutes(server);

server.use(loginRouter);