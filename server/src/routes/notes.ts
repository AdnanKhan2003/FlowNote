import { Router, NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { notes, collaborators, activityLogs, users } from '../db/schema.js';
import { eq, and, or, desc } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = Router();


router.get('/activity/all', authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  try {
    const logs = await db.select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      noteTitle: notes.title,
      userEmail: users.email
    })
    .from(activityLogs)
    .leftJoin(notes, eq(activityLogs.noteId, notes.id))
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(or(eq(activityLogs.userId, userId), eq(notes.ownerId, userId)))
    .orderBy(desc(activityLogs.timestamp))
    .limit(50);

    res.json(logs || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error });
  }
});


router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user!.userId;

  try {
    const newNote = await db.insert(notes).values({
      title: title || '',
      content: content || '',
      ownerId: userId,
    }).returning();

    await db.insert(activityLogs).values({
      userId,
      noteId: newNote[0].id,
      action: 'CREATE',
    });

    res.status(201).json(newNote[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user!.userId;
  try {
    const results = await db.select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      ownerId: notes.ownerId,
      isPublic: notes.isPublic,
      createdAt: notes.createdAt,
      updatedAt: notes.updatedAt,
    })
    .from(notes)
    .leftJoin(collaborators, eq(notes.id, collaborators.noteId))
    .where(or(eq(notes.ownerId, userId), eq(collaborators.userId, userId)));

    const uniqueNotes = Array.from(new Map(results.map(n => [n.id, n])).values());
    res.json(uniqueNotes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
});


router.get('/:noteUUID', async (req, res, next: NextFunction) => {
  const rawId = req.params.noteUUID;
  
  if (!rawId || rawId === 'activity') return next();


  const targetNoteId = String(rawId);
  console.log('[DEBUG] Fetching note with ID:', targetNoteId);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  let userId: string | null = null;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
      userId = String(decoded.userId);
    } catch (err) {}
  }

  try {
    const noteData = await db.select().from(notes).where(eq(notes.id, targetNoteId)).limit(1);
    
    if (noteData.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const currentNote = noteData[0];
    let currentUserPermission = 'VIEWER';

    if (userId) {
      if (currentNote.ownerId === userId) {
        currentUserPermission = 'OWNER';
      } else {
        const collabInfo = await db.select().from(collaborators).where(
          and(eq(collaborators.noteId, targetNoteId), eq(collaborators.userId, userId))
        ).limit(1);
        
        if (collabInfo.length > 0) {
          currentUserPermission = collabInfo[0].permission;
        } else if (!currentNote.isPublic) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }
    } else if (!currentNote.isPublic) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    res.json({ ...currentNote, currentUserPermission });
  } catch (error) {
    console.error('[DATABASE ERROR]', error);
    res.status(500).json({ message: 'Error fetching note', error });
  }
});


router.put('/:noteUUID', authenticateToken, async (req, res) => {
  const targetNoteId = String(req.params.noteUUID);
  const { title, content, isPublic } = req.body;
  const userId = req.user!.userId;

  try {
    const existing = await db.select().from(notes).where(eq(notes.id, targetNoteId)).limit(1);
    if (existing.length === 0) return res.status(404).json({ message: 'Note not found' });

    const collab = await db.select().from(collaborators).where(
      and(eq(collaborators.noteId, targetNoteId), eq(collaborators.userId, userId))
    ).limit(1);

    const hasPermission = existing[0].ownerId === userId || (collab.length > 0 && collab[0].permission === 'EDITOR');
    if (!hasPermission) return res.status(403).json({ message: 'Permission denied' });

    const updated = await db.update(notes).set({
      title: title ?? existing[0].title,
      content: content ?? existing[0].content,
      isPublic: isPublic ?? existing[0].isPublic,
      updatedAt: new Date(),
    }).where(eq(notes.id, targetNoteId)).returning();

    await db.insert(activityLogs).values({
      userId,
      noteId: targetNoteId,
      action: 'UPDATE',
    });

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
});


router.delete('/:noteUUID', authenticateToken, async (req, res) => {
  const targetNoteId = String(req.params.noteUUID);
  const userId = req.user!.userId;

  try {
    const existing = await db.select().from(notes).where(eq(notes.id, targetNoteId)).limit(1);
    if (existing.length === 0) return res.status(404).json({ message: 'Note not found' });

    if (existing[0].ownerId !== userId) return res.status(403).json({ message: 'Only owners can delete' });

    await db.delete(collaborators).where(eq(collaborators.noteId, targetNoteId));
    await db.delete(activityLogs).where(eq(activityLogs.noteId, targetNoteId));
    await db.delete(notes).where(eq(notes.id, targetNoteId));

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
});


router.post('/:noteUUID/collaborators', authenticateToken, async (req, res) => {
  const targetNoteId = String(req.params.noteUUID);
  const { email, permission } = req.body; 
  const userId = req.user!.userId;

  try {
    const noteData = await db.select().from(notes).where(eq(notes.id, targetNoteId)).limit(1);
    if (!noteData[0] || noteData[0].ownerId !== userId) return res.status(403).json({ message: 'Only owners can share' });

    const targetUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!targetUser[0]) return res.status(404).json({ message: 'User not found' });

    await db.insert(collaborators).values({
      noteId: targetNoteId,
      userId: targetUser[0].id,
      permission,
    }).onConflictDoUpdate({
      target: [collaborators.noteId, collaborators.userId],
      set: { permission }
    });

    await db.insert(activityLogs).values({
      userId,
      noteId: targetNoteId,
      action: `SHARE_${permission}`,
    });

    res.json({ message: 'Collaborator added/updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error mapping collaborator', error });
  }
});

export default router;
