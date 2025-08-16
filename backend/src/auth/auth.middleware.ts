/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddlaware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded =  jwt.verify(token, String(process.env.JWT_SECRET), { ignoreExpiration: false }) as unknown as {
            email:string,
            id: number,
        };
        (req as any).user = {
        email: decoded.email,
        id: decoded.id
      };
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido' });
    }
  }
}
