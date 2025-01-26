import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils";

export const RequestAuthorizer = async ( 
  req: Request, res: Response, next: NextFunction
) => {
  console.log("STEP 0 : RequestAuthorizer called", req.headers.authorization);
  try {
    if (!req.headers.authorization) {
      // return res
      res
        .status(403)  // Dont have permission
        .json({ error: "Unauthorized due to authorization token missing!" });
    }
    const userData = await ValidateUser(req.headers.authorization as string);
    console.log("STEP 0 : RequestAuthorizer userData", userData);
    req.user = userData;
    next();
  } catch (error) {
    console.log("error", error);
    // return res.status(403).json({ error });
    res.status(403).json({ error });
  }
};