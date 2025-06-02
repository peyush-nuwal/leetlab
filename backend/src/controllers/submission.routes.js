import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAllSubmissionsForProblem, getSubmissionsForProblem } from "./submission.controller.js";

const submissionRoutes = express.Router()

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission);
submissionRoutes.get("/get-submission/:problemId", authMiddleware, getSubmissionsForProblem);
submissionRoutes.get("/get-submission-count/:problemId", authMiddleware, getAllSubmissionsForProblem);

export default submissionRoutes;


