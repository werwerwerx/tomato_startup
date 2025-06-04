import { account_table, verification_codes_table } from "@/shared/db/schema";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { envConfig } from "@/shared/lib/config";
import { Resend } from "resend";

export class AuthService {
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
      throw new Error("404");
    }
    const verificatoinCode = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
    const verificationCodeHash = createHash("sha256").update(verificatoinCode.toString()).digest("hex");

    await this.db.insert(verification_codes_table).values({
      code: verificatoinCode.toString(),
      expiresAt: verificationCodeExpiresAt,
      accountId: userCandidate.accountId,
    })

    return userCandidate;
  }

  private async generateVerificationCode(userAccount: typeof account_table.$inferSelect){
    const verificatoinCode = Math.floor(100000 + Math.random() * 900000); // 6 digits
    const verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes
    const verificationCodeHash = createHash("sha256").update(verificatoinCode.toString()).digest("hex");

    await this.db.insert(verification_codes_table).values({
      code: verificationCodeHash.toString(),
      expiresAt: verificationCodeExpiresAt,
      accountId: userAccount.id,
    })

    return {
      code: verificatoinCode,
      expiresAt: verificationCodeExpiresAt,
    }
  }

  async sendVerificationMail(userAccount: typeof account_table.$inferSelect){
    if(userAccount.provider !== "email"){
      throw new Error("400");
    }

    const metadataCode = await jwt.sign({
      accountId: userAccount.id,
      email: userAccount.email,
    }, envConfig.JWT_SECRET, {
      expiresIn: "10m",
    })

    const verificationCode = await this.generateVerificationCode(userAccount);

    const resend = new Resend(envConfig.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: userAccount.email,
      subject: "Verification Code",
      html: `<p>Your verification code is ${verificationCode.code}</p>`,
    })


  }
}
