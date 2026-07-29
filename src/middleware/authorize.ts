import { Request, Response, NextFunction } from "express";

import { AppError } from "../shared/errors/AppError";

type Role =
    | "USER"
    | "ADMIN";

export function authorize(
    ...roles: Role[]
) {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user) {
            throw new AppError(
                "Authentication required.",
                401
            );
        }

        if (
            !roles.includes(req.user.role as Role)
        ) {
            throw new AppError(
                "Forbidden.",
                403
            );
        }

        return next();
    };
}