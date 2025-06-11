import { Resend } from "resend";
import { envConfig } from "./config";

export const resend = new Resend(envConfig.RESEND_API_KEY);
