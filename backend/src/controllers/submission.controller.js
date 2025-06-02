import {db} from "../libs/db.js"

export const getAllSubmission = async(req, res) => {
    try {
        const userId = req.user.id;

        const submission = await db.submission.findMany({
            where: {
                userId: userId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully!",
            submission
        })
    } catch (error) {
        console.log("Error in getting all subissionns: ", error);
        res.status(400).json({error: "Failed to fetch all submissions"})
    }
}

export const getSubmissionsForProblem = async(req, res) => {
    try {
        const userId = req.user.id;
        const problemId = req.params.problemId;

        const submissions = await db.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            submissions
        })

    } catch (error) {
        console.log("Error in getting submission: ", error);
        res.status(400).json({error: "Failed to fetch a submission for problem"})
    }
}

export const getAllSubmissionsForProblem = async(req, res) => {
    try {
        const problemId = req.params.problemId;
        
        const submissions = await db.submission.count({
            where: {
                problemId: problemId
            }
        })

        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully!",
            submissions
        
        })


    } catch (error) {
        console.log("Error in getting all subissionns for problem: ", error);
        res.status(400).json({error: "Failed to fetch all submissions for problem"})
    }
}