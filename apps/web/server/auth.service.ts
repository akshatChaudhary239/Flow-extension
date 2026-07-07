import { prisma } from "../infrastructure/prisma";
import argon2 from "argon2";
import { generateSessionToken, hashToken } from "../domain/auth";
import { sendVerificationEmail, sendPasswordResetEmail } from "../infrastructure/email";
import crypto from "crypto";

export class AuthService {
  static async register(email: string, passwordRaw: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      // Return a generic success to prevent email enumeration,
      // but don't actually register. In a real app, maybe send a "you already have an account" email.
      return { success: true };
    }

    const hashedPassword = await argon2.hash(passwordRaw);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(verifyToken);
    
    // Expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await sendVerificationEmail(email, verifyToken);

    return { success: true };
  }

  static async verifyEmail(token: string) {
    const tokenHash = hashToken(token);
    
    const verification = await prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new Error("Invalid or expired token");
    }

    await prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerifiedAt: new Date() },
    });

    await prisma.emailVerificationToken.delete({
      where: { id: verification.id },
    });

    return { success: true };
  }

  static async login(email: string, passwordRaw: string, rememberMe: boolean, ipHash?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await argon2.verify(user.hashedPassword, passwordRaw);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    if (!user.emailVerifiedAt) {
      throw new Error("Email not verified");
    }

    const token = generateSessionToken();
    const tokenHash = hashToken(token);
    
    // 30 days if rememberMe, otherwise 24 hours
    const expiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
        ipHash,
        userAgent,
      },
    });

    return { token, expiresAt };
  }

  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: true }; // Prevent enumeration
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await sendPasswordResetEmail(email, resetToken);

    return { success: true };
  }

  static async resetPassword(token: string, newPasswordRaw: string) {
    const tokenHash = hashToken(token);
    
    const reset = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await argon2.hash(newPasswordRaw);

    await prisma.user.update({
      where: { id: reset.userId },
      data: { hashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    });

    // Invalidate all existing sessions
    await prisma.session.deleteMany({
      where: { userId: reset.userId },
    });

    return { success: true };
  }
}
