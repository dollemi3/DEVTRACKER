
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "PROVE";

// 회원가입
router.post("/register", async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ message: "모든 필드를 입력해주세요." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword
        }
    });


    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ message: "회원가입 성공", token });
});

// ✅ 로그인 라우트
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // 입력값 확인
    if (!email || !password) {
        return res.status(400).json({ message: "이메일과 비밀번호를 모두 입력해주세요." });
    }

    // 유저 찾기
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(401).json({ message: "존재하지 않는 사용자입니다." });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    console.log("issued token payload:", { id: user.id });
    // JWT 발급
    const token = jwt.sign(
        { id: user.id, email: user.email },  // ✅ id 포함
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({ message: "로그인 성공", token });
});
// ✅ 내 정보 확인 API (로그인된 사용자만 접근)
router.get("/me", authenticateToken, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, username: true, createdAt: true }
    });

    res.status(200).json({ user });
});

export default router;