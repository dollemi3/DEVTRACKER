import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

// JWT 인증 미들웨어
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        console.log("decoded token:", decoded);  // 👈 확인용
        req.user = decoded;  // 여기서 id 포함돼야 함
        next();
    });

}

// 프로필 업데이트
router.put("/", authenticateToken, async (req, res) => {
    console.log("req.user:", req.user);
    console.log("받은 바디:", req.body);

    const { nickname, statusMessage, profileImage, usingTech } = req.body;

    try {
        const updated = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                username: nickname || '',
                statusMessage: statusMessage || '',
                profileImage: profileImage || null,
                usingTech: usingTech ? JSON.stringify(usingTech) : null,
            },
        });

        res.json({
            message: "프로필 업데이트 성공",
            user: {
                ...updated,
                usingTech: JSON.parse(updated.usingTech || "[]"),
            },
        });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                username: true,
                statusMessage: true,
                profileImage: true,
                usingTech: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        // usingTech가 JSON 문자열이라면 파싱
        const parsedTech = user.usingTech
            ? JSON.parse(user.usingTech)
            : [];

        res.json({
            user: {
                ...user,
                usingTech: parsedTech
            }
        });

    } catch (err) {
        console.error("프로필 조회 에러:", err);
        res.status(500).json({ error: "내부 서버 오류" });
    }
});

export default router;
