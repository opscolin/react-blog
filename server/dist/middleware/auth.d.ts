import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: number;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function generateToken(userId: number): string;
//# sourceMappingURL=auth.d.ts.map