// User Management Service using Drizzle ORM
// Example service showing how to use Drizzle for CRUD operations

import { eq, and, or, desc, sql } from 'drizzle-orm';
import type { Database } from './index';
import { authUsers, authSessions } from './schema';
import { hashPassword, verifyPassword, generateToken } from '../auth-service';

export class UserService {
    constructor(private db: Database) { }

    /**
     * Tạo người dùng mới
     */
    async createUser(data: {
        username: string;
        email: string;
        password: string;
        displayName: string;
    }) {
        const userId = crypto.randomUUID();
        const passwordHash = await hashPassword(data.password);
        const now = Date.now();

        await this.db.insert(authUsers).values({
            id: userId,
            username: data.username.toLowerCase(),
            email: data.email.toLowerCase(),
            passwordHash,
            displayName: data.displayName,
            createdAt: now,
            lastLogin: now,
            isActive: 1,
            isAdmin: 0,
        });

        return userId;
    }

    /**
     * Tìm người dùng theo email hoặc username
     */
    async findByCredentials(identifier: string) {
        const user = await this.db
            .select()
            .from(authUsers)
            .where(
                or(
                    eq(authUsers.email, identifier.toLowerCase()),
                    eq(authUsers.username, identifier.toLowerCase())
                )
            )
            .limit(1);

        return user[0] || null;
    }

    /**
     * Tìm người dùng theo ID
     */
    async findById(userId: string) {
        const user = await this.db
            .select({
                id: authUsers.id,
                username: authUsers.username,
                email: authUsers.email,
                displayName: authUsers.displayName,
                avatar: authUsers.avatar,
                bio: authUsers.bio,
                role: authUsers.role,
                createdAt: authUsers.createdAt,
                lastLogin: authUsers.lastLogin,
                isAdmin: authUsers.isAdmin,
            })
            .from(authUsers)
            .where(eq(authUsers.id, userId))
            .limit(1);

        return user[0] || null;
    }

    /**
     * Cập nhật thông tin người dùng
     */
    async updateUser(
        userId: string,
        data: Partial<{
            displayName: string;
            avatar: string;
            bio: string;
            email: string;
            username: string;
        }>
    ) {
        await this.db
            .update(authUsers)
            .set({
                ...data,
                updatedAt: Date.now(),
            })
            .where(eq(authUsers.id, userId));

        return this.findById(userId);
    }

    /**
     * Đổi mật khẩu
     */
    async changePassword(userId: string, newPassword: string) {
        const passwordHash = await hashPassword(newPassword);

        await this.db
            .update(authUsers)
            .set({
                passwordHash,
                updatedAt: Date.now(),
            })
            .where(eq(authUsers.id, userId));

        // Xóa tất cả session của user
        await this.db
            .delete(authSessions)
            .where(eq(authSessions.userId, userId));
    }

    /**
     * Xóa người dùng
     */
    async deleteUser(userId: string) {
        await this.db
            .delete(authUsers)
            .where(eq(authUsers.id, userId));
    }

    /**
     * Lấy danh sách tất cả người dùng (Admin)
     */
    async getAllUsers(options?: {
        limit?: number;
        offset?: number;
        search?: string;
    }) {
        const limit = options?.limit || 50;
        const offset = options?.offset || 0;

        let query = this.db
            .select({
                id: authUsers.id,
                username: authUsers.username,
                email: authUsers.email,
                displayName: authUsers.displayName,
                avatar: authUsers.avatar,
                role: authUsers.role,
                createdAt: authUsers.createdAt,
                lastLogin: authUsers.lastLogin,
                isActive: authUsers.isActive,
                isAdmin: authUsers.isAdmin,
            })
            .from(authUsers);

        if (options?.search) {
            query = query.where(
                or(
                    sql`${authUsers.username} LIKE ${`%${options.search}%`}`,
                    sql`${authUsers.email} LIKE ${`%${options.search}%`}`,
                    sql`${authUsers.displayName} LIKE ${`%${options.search}%`}`
                )
            );
        }

        const users = await query
            .orderBy(desc(authUsers.createdAt))
            .limit(limit)
            .offset(offset);

        return users;
    }

    /**
     * Đếm số người dùng
     */
    async countUsers(search?: string) {
        let query = this.db
            .select({ count: sql<number>`count(*)` })
            .from(authUsers);

        if (search) {
            query = query.where(
                or(
                    sql`${authUsers.username} LIKE ${`%${search}%`}`,
                    sql`${authUsers.email} LIKE ${`%${search}%`}`,
                    sql`${authUsers.displayName} LIKE ${`%${search}%`}`
                )
            );
        }

        const result = await query;
        return result[0]?.count || 0;
    }

    /**
     * Cập nhật last login
     */
    async updateLastLogin(userId: string) {
        await this.db
            .update(authUsers)
            .set({ lastLogin: Date.now() })
            .where(eq(authUsers.id, userId));
    }

    /**
     * Kích hoạt/Vô hiệu hóa người dùng
     */
    async toggleUserStatus(userId: string, isActive: boolean) {
        await this.db
            .update(authUsers)
            .set({
                isActive: isActive ? 1 : 0,
                updatedAt: Date.now()
            })
            .where(eq(authUsers.id, userId));
    }
}
