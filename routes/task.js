import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware.js';


const router = express.Router();
const prisma = new PrismaClient();

// 전체 불러오기
router.get("/:projectId", authenticateToken, async (req, res) => {
    const { projectId } = req.params;
    const tasks = await prisma.task.findMany({
        where: { projectId: Number(projectId) },
        orderBy: { createdAt: 'asc' },
    });
    res.json({ tasks }); 0
});

// 추가
router.post("/", authenticateToken, async (req, res) => {
    const { title, priority, projectId } = req.body;

    if (!title || !priority || !projectId) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    try {
        const task = await prisma.task.create({
            data: {
                title,
                priority,
                completed: false,
                projectId: Number(projectId),
            },
        });
        res.json({ task });
    } catch (error) {
        console.error("Task 생성 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 완료 여부 수정 / 제목 변경
router.put("/:taskId", authenticateToken, async (req, res) => {
    const { title, completed, priority } = req.body;
    const { taskId } = req.params;

    if (title == null || completed == null || priority == null) {
        return res.status(400).json({ message: "필수 필드 누락" });
    }

    try {
        const task = await prisma.task.update({
            where: { id: Number(taskId) },
            data: { title, completed, priority },
        });
        res.json({ task });
    } catch (error) {
        console.error("Task 수정 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 삭제
router.delete("/:taskId", authenticateToken, async (req, res) => {
    const { taskId } = req.params;

    try {
        await prisma.task.delete({ where: { id: Number(taskId) } });
        res.json({ message: "Deleted" });
    } catch (error) {
        console.error("Task 삭제 오류:", error);
        res.status(500).json({ message: "삭제 실패" });
    }
});


export default router;