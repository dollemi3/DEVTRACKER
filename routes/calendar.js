import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", authenticateToken, async (req, res) => {
    const { title, date, type, description, projectId } = req.body;

    if (!title || !date || !type || !description || !projectId) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    try {
        const event = await prisma.calendarEvent.create({
            data: {
                title,
                date: new Date(date), // 문자열 to Date
                type,
                description,
                project: { connect: { id: Number(projectId) } }
            },
        });

        res.status(201).json({ event });
    } catch (error) {
        console.error("이벤트 저장 실패:", error);
        res.status(500).json({ message: "이벤트 저장 실패" });
    }
});


router.get("/:projectId", authenticateToken, async (req, res) => {
    const { projectId } = req.params;

    try {
        const events = await prisma.calendarEvent.findMany({
            where: {
                projectId: Number(projectId),
            },
            orderBy: { date: "asc" },
        });

        res.json({ events });
    } catch (error) {
        console.error("이벤트 불러오기 실패:", error.message, error.meta);
        res.status(500).json({ message: "서버 오류" });
    }
});

// DELETE /api/calendar/:id
router.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await prisma.calendarEvent.delete({
            where: { id: Number(id) },
        });

        res.json({ message: "이벤트 삭제 완료", deleted });
    } catch (error) {
        console.error("이벤트 삭제 실패:", error);
        res.status(500).json({ message: "서버 오류 또는 해당 이벤트 없음" });
    }
});

export default router;
