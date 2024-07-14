import { NextFunction, Request, Response } from "express"
export class MissingPropertyError extends Error {
    constructor(public propertyName: string) {
        super(`Custom property '${propertyName}' is missing from request object.`);
        this.name = 'MissingPropertyError';
    }
}
function isUserRequest(obj: any): obj is Request {
    return typeof obj === "object" && obj !== null && "user" in obj;
}

import { ParamsDictionary, Query } from "express-serve-static-core";
interface ICustomRequestParams extends ParamsDictionary {
    userId: string;
}

interface ICustomRequestBody {
    userDetails: {
        name: string;
        email: string;
    };
}

interface ICustomRequestQuery extends Query {
    search: string;
    sortBy: string;
}

export const HelloWorldController = {
    default: async (req: Request<never, never, never, never>, res: Response, next: NextFunction) => {
        let message
        if (isUserRequest(req)) {
            const customValue = req.user;
            // Use customValue safely
        } else {
            // Handle case where customProperty is not present
        }
        switch (req.language) {
            default:
            case "en": {
                message = "Hello, World!"
                break
            }
            case "es": {
                message = "¡Hola, mundo!"
                break
            }
            case "it": {
                message = "Ciao, mondo!"
                break
            }
        }

        res.json(message)
    },
    hello: async (req: Request<never, never, never, never>, res: Response, next: NextFunction) => {
        if (!('user' in req)) {
            return next(new MissingPropertyError('user'));
        }
        console.log('request', req.user)
        res.json(`Hey, ${req.user?.name}`)
    },

    createUser: async (req: Request<{}, {}, ICustomRequestBody>, res: Response, next: NextFunction) => {
        const { userDetails } = req.body;
        if (!userDetails.email) {
            return next(new MissingPropertyError('userDetails'));
        }
        res.json({ message: `User ${userDetails.name} added successfully.` });
    },

    getUserById: async (req: Request<ICustomRequestParams>, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        if (!userId) {
            return next(new MissingPropertyError('userId'));
        }
        res.json({ message: `User ${userId} retrieved successfully.` });
    },

    searchUsers: async (req: Request<{}, {}, {}, ICustomRequestQuery>, res: Response, next: NextFunction) => {
        const { search, sortBy } = req.query;
        if (!search || !sortBy) {
            return next(new MissingPropertyError('search or sortBy'));
        }
        res.json({ message: `Searching for ${search}, sorted by ${sortBy}.` });
    }
}
