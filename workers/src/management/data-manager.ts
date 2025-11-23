import { hashPassword } from '../auth-service';

export async function updateUserData(db: D1Database, userId: string, data: any) {
    const allowedFields = ['displayName', 'avatar', 'bio', 'email', 'username'];
    const updates: string[] = [];
    const values: any[] = [];

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            updates.push(`${field} = ?`);
            values.push(data[field]);
        }
    }

    if (updates.length === 0) {
        throw new Error('No valid fields to update');
    }

    values.push(userId);

    const query = `UPDATE auth_users SET ${updates.join(', ')}, updated_at = ? WHERE id = ?`;
    values.splice(values.length - 1, 0, Date.now()); // Insert updated_at before userId

    await db.prepare(query).bind(...values).run();

    return await db.prepare('SELECT id, username, email, displayName, avatar, bio, role, created_at FROM auth_users WHERE id = ?').bind(userId).first();
}

export async function changeUserPassword(db: D1Database, userId: string, newPassword: string) {
    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    const passwordHash = await hashPassword(newPassword);

    await db.prepare('UPDATE auth_users SET password_hash = ?, updated_at = ? WHERE id = ?')
        .bind(passwordHash, Date.now(), userId)
        .run();

    // Invalidate sessions? Maybe not required for simple password change, but good practice.
    // For now, keep sessions active or let user decide.
    return { success: true };
}
