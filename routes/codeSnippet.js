import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();
console.log("📦 codeSnippetRoutes loaded");
router.post("/upload", authenticateToken, async (req, res) => {
    const { title, content, language, projectId, isPublic } = req.body;
    const numericProjectId = parseInt(projectId, 10); // 문자열 → 정수로 변환
    if (!title || !content || !language || typeof isPublic !== 'boolean' || isNaN(numericProjectId)) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    try {
        const snippet = await prisma.codeSnippet.create({
            data: {
                title,
                content,
                language,
                isPublic,
                project: { connect: { id: numericProjectId } },
            },
        });

        res.status(201).json({ snippet });
    } catch (err) {
        console.error("코드 저장 실패:", err);
        res.status(500).json({ message: "코드 저장 실패" });
    }
});
// 📌 [GET] 특정 프로젝트의 코드 스니펫들 불러오기
router.get("/project/:projectId", authenticateToken, async (req, res) => {
    console.log("🔥 GET /project/:projectId 호출됨"); // 이거 찍히는지 보기
    const { projectId } = req.params;

    try {
        const snippets = await prisma.codeSnippet.findMany({
            where: { projectId: Number(projectId) },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({ snippets });
    } catch (err) {
        console.error("코드 스니펫 불러오기 실패:", err);
        res.status(500).json({ message: "코드 스니펫을 불러오지 못했습니다." });
    }
});

router.patch("/:id", authenticateToken, async (req, res) => {
    const snippetId = parseInt(req.params.id);
    const { title, content, language, isPublic } = req.body;

    try {
        const updated = await prisma.codeSnippet.update({
            where: { id: snippetId },
            data: {
                title,
                content,
                language,
                isPublic,
            },
        });
        res.json({ snippet: updated });
    } catch (err) {
        console.error("코드 수정 실패:", err);
        res.status(500).json({ message: "코드 수정 실패" });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
        const existing = await prisma.codeSnippet.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: "해당 스니펫 없음" });
        }

        await prisma.codeSnippet.delete({ where: { id } });
        res.json({ message: "삭제 완료" });
    } catch (error) {
        console.error("삭제 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

export default router;
