import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
    try {
        const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
        const userId = req.user.id;

        // validate test cases
        if (
            !Array.isArray(stdin) ||
            stdin.length === 0 || 
            !Array.isArray(expected_outputs) ||
            expected_outputs.length !== stdin.length
        )

        {
            return res.status(400).json({error: "Invalied or missing test cases"})
        }

        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
            wait: false,
        }));

        // send this batch to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res)=>res.token);

        const results = await pollBatchResults(tokens);

        // pool judge0 for results of all submitted test cases
        console.log("Results: ", results);
        
        res.status(200).json({
            message: "Code executed"
        })

    } catch (error) {

    }
}