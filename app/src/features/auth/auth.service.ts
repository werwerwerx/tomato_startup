import { account_table, verification_codes_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { envConfig } from "@/shared/lib/config";
import { Resend } from "resend";
import { sendLoginVerificationMail, sendRegisterVerificationCode } from "@/shared/lib/resend";
import { z } from "zod";
import db from "@/shared/db";


const  AuthJwtPayloadSchema = z.object({
  accountId: z.number(),
  email: z.string(),
})



 class AuthService {
  constructor(private readonly db: NodePgDatabase) {}
  
  /**
   * @returns User data, error with http code
   **/
  async login(email: string) {
    const [userCandidate] = await this.db
      .select({
        userId: account_table.userId,
        accountId: account_table.id,

        email: account_table.email,
        provider: account_table.provider,
        name: account_table.name,
      })
      .from(account_table)
      .where(eq(account_table.email, email))
      .limit(1)

    if (!userCandidate) {
      throw new Error("409");
    }

    if(userCandidate.provider === "email"){
      await this.sendLoginMail(userCandidate.accountId, userCandidate.email!);
    }

    return userCandidate;
  }

  async register(email: string) {
    const userCandidate = await this.db.select().from(account_table).where(eq(account_table.email, email)).limit(1);
    if (userCandidate) {
      throw new Error("409");
    }

    const { code } = await this.processVerificationCode(email);
    await sendRegisterVerificationCode(email, String(code));

    return {
      message: "Verification code sent",
    }
  }

  private async processVerificationCode(email: string){
    const verificatoinCode = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
    const verificationCodeHash = createHash("sha256").update(verificatoinCode.toString()).digest("hex");

    await this.db.insert(verification_codes_table).values({
      code: verificationCodeHash.toString(),
      expiresAt: verificationCodeExpiresAt,
      email,
    })



    return {
      code: verificatoinCode,
    }
  }

  private async sendLoginMail(accId: number, email: string) {
    const token = await jwt.sign({
      accountId: accId,
      email,
    }, envConfig.JWT_SECRET, {
      expiresIn: "10m",
    })

    const verificationLink = `${envConfig.IS_HTTPS ? "https" : "http"}://${envConfig.APP_URL}/auth/login/verify?token=${token}`;

    await sendLoginVerificationMail(email, verificationLink);
  }
}
export const authService = new AuthService(db);