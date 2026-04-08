import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: 'EDITOR',
    }).returning();

    res.status(201).json({ message: 'User registered successfully', user: { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.select().from(users)
      .where(and(eq(users.email, email), eq(users.role, 'EDITOR')))
      .limit(1);
    
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials or access restricted.' });
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user[0].id, email: user[0].email, role: user[0].role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.select().from(users)
      .where(and(eq(users.email, email), eq(users.role, 'ADMIN')))
      .limit(1);

    if (user.length === 0) {
      return res.status(403).json({ message: 'Access denied: Administrators only' });
    }

    const isValid = await bcrypt.compare(password, user[0].password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user[0].id, email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user[0].id, email: user[0].email, role: user[0].role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in admin', error });
  }
});

export default router;
