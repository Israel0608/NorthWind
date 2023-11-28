import { Request, Response, NextFunction } from "express";
import cyber from "../2-utils/cyber";


function verifyToken(request: Request, response: Response, next: NextFunction) {
    // Header:
    // Authorization: Bearer my-token
                    //01234567890       

    // Take  authorization header: 
    const authorization = request.header("authorization")

    // Extract the token:
    const token = authorization?.substring(7);

    // Verify:
    cyber.verifyToken(token);

    // All is good:
    next();
}

export default verifyToken