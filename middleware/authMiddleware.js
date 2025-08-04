import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "토큰이 없습니다." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 요청에 사용자 정보 추가
        next();
    } catch (err) {
        return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }
};
