import { HandlerContext, HandlerEvent } from "@netlify/functions";
import serverless from "serverless-http";
import app from "../../src/app";

const serverlessHandler = serverless(app);

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  return await serverlessHandler(event, context);
};
