import {db} from "../libs/db.js"
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    console.log("Request: ", req);

    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body;
    
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({error: "You are not allowed to create a problem"})
    }
    
    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);
            console.log("LanguageId: ", languageId);  
            
            if (!languageId) {
                return res.status(400).json({error: `Language ${language} is not supported`})
            }
            
            const submissions = testcases.map(({input, output})=>({ 
                source_code: solutionCode,
                language_id: languageId,
                stdin: input, 
                expected_output: output
            }))
            
            const submisssionResults = await submitBatch(submissions);
            
            const tokens = submisssionResults.map((res)=>res.token);
            
            const results = await pollBatchResults(tokens);
            console.log("From controllers: ", results);
            
            for (let i=0; i<results.length; i++) {
                const result = results[i];
                
                if (result.status.id !== 3) {
                    return res.status(400).json({error :`Testcase ${i+1} failed for language ${language}`})
                }
                
                // save problem in database
                const newProblem = await db.problem.create({
                    data: {
                        title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId: req.user.id
                    }
                })
                
                // console.log("Problem: ", newProblem)

                return res.status(201).json(newProblem);
            }   
        }

    } catch (error) {
        console.log("Error in adding a new problem", error);

        return res.status(400).json({
            success: false,
            message: "Failed to add a new problem"
        })
    }

}

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();

        if (!problems) {
            return res.status(404).json({
                error: "No problem found"
            })
        }
        
        // all set
        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            problems
        })
    } catch (error) {
        console.log("Error in getting all problems: ", error)
        return res.status(400).json({
            message: "Error occured in fetching problems"
        })
    }
}

export const getProblemById = async (req, res) => {
    const {id} = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Problem found",
            problem
        })

    } catch (error) {
        console.log("Problem found by id: ", error);

        return res.status(400).json({
            error: "Error while fetching problem by id"
        })
    }
}

export const updateProblem = async (req, res) => {
    // get id of problem to be updated
    // check if problem exsists
    // run update query

    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body;
    const {id} = req.params;

    console.log("ID for update problem: ", id)
    const problem = await db.problem.findUnique({
        where: {
            id: id
        }
    })

    if (!problem) {
        return res.status(404).json({
            message: "No problem found"
        })
    }

    try {
        for(const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getJudge0LanguageId(language);
            console.log("LanguageId: ", languageId);  
            
            if (!languageId) {
                return res.status(400).json({error: `Language ${language} is not supported`})
            }
            
            const submissions = testcases.map(({input, output})=>({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input, 
                expected_output: output
            }))
            
            const submisssionResults = await submitBatch(submissions);
            
            const tokens = submisssionResults.map((res)=>res.token);
            
            const results = await pollBatchResults(tokens);
            console.log("From controllers: ", results);
            
            for (let i=0; i<results.length; i++) {
                const result = results[i];
                
                if (result.status.id !== 3) {
                    return res.status(400).json({error :`Testcase ${i+1} failed for language ${language}`})
                }
                
                // save problem in database
                const newProblem = await db.problem.update({
                    where: {
                        id: id
                    },

                    data: {
                        title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId: req.user.id
                    }
                })

                return res.status(201).json(newProblem);
            }   
        }

    } catch (error) {
        console.log("Error in updating the problem: ", error);

        return res.status(400).json({
            message: "Error in updating problem"
        })
    }
}

export const deleteProblem = async (req, res) => {
    const {id} = req.params;
    // now to find if i have a problem with this id

    try {
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })

        if (!problem) {
            return res.status(404).json({
                error: "No problem found"
            })
        }

        // now problem exsists
        await db.problem.delete({where: {id}})

        return res.status(200).json({
            success: true,
            message: "Problem deleted successfully"
        })

    } catch (error) {
        return res.status(400).json({
            message: "Error in deleting problem"
        })
    }
}

export const getAllProblemsSolvedByUser = async (req, res) => {
    try {
        const problems = await db.problem.findMany({
            where: {
                solvedBy: {
                    some: {
                        userId: req.user.id
                    }
                }
            },
            include: {
                solvedBy: {
                    where: {
                        userId: req.user.id
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problems
        })

    } catch (error) {
        console.log("Error in fetching problem: ", error);
        res.status(400).json({
            message: "Failed to fetch problems"
        })
    }
}

