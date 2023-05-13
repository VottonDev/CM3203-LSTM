// @ts-ignore
import { Client } from '@apperate/iexjs';
import * as dotenv from 'dotenv';
dotenv.config();

const IEXCLoudToken = process.env.IEXCLOUDTOKEN || "pk_7d141bac1055497daaff5936aee7ed9f";

const client = new Client({
  api_token: IEXCLoudToken,
  version: 'v1',
});

export default client;
