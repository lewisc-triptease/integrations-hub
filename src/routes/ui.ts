import { Hono } from "hono";
import { handler as homeHandler } from "../home/handler.js";

export const uiRoutes = new Hono();

uiRoutes.get('/', homeHandler());
