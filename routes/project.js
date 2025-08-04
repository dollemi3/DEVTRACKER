import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'PROVE'; // 안전한 기본값 제공

// 🔐 미들웨어: 토큰 인증
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: '토큰이 없습니다.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
        }
        req.user = user;
        next();
    });
};

// 📌 [GET] 사용자 프로젝트 목록 조회
router.get('/', authenticateToken, async (req, res) => {
    console.log("📥 프로젝트 목록 요청 도착");
    try {
        const projects = await prisma.project.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({ projects });
    } catch (err) {
        console.error('프로젝트 조회 실패:', err);
        res.status(500).json({ message: '프로젝트 목록을 불러오지 못했습니다.' });
    }
});

// ➕ [POST] 새 프로젝트 생성
router.post('/', authenticateToken, async (req, res) => {
    console.log('✅ 프로젝트 라우터 살아있음');
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: '프로젝트 이름은 필수입니다.' });
    }

    try {
        const newProject = await prisma.project.create({
            data: {
                name,
                description: description || '',
                userId: req.user.id,
            },
        });

        res.status(201).json({ project: newProject });
    } catch (err) {
        console.error('프로젝트 생성 실패:', err);
        res.status(500).json({ message: '프로젝트 생성에 실패했습니다.' });
    }
});

export default router;
