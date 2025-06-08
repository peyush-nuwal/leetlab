import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import {db} from "../libs/db.js"

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
        console.log("I have reached here")
        const submitResponse = await submitBatch(submissions);
        console.log("submitResult: ", submitResponse);
        
        const tokens = submitResponse.map((res)=>res.token);

        const results = await pollBatchResults(tokens);

        // pool judge0 for results of all submitted test cases
        console.log("Results: ", results);
        
        
        // analyse test case result
        let allPassed = true;
        
        const detailedResults = results.map((result, i) => {
            const stdout = result.stdout?.trim();
            const expected_output = expected_outputs[i]?.trim();
            const passed = stdout === expected_output;
            
            if (!passed) allPassed = false;
            
            return {
                testcase: i+1,
                passed,
                stdout,
                expected: expected_output,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memory: result.memory?`${result.memory} KB` : undefined,
                time: result.time?`${result.time} s` : undefined
            }
        })
        
        console.log("detailedResults: ", detailedResults[0].testcase);
        
        // store submission summary
        
        const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });
        
        // if allPassed is true then mark as done
        console.log("Submission :", submission.id);

        if (allPassed) {
            await db.ProblemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId, problemId
                    }
                },
                update: {},
                create: {
                    userId, problemId,
                },
            });
        }
        
        // save individual tescases using detailed output
        const testCaseResults = detailedResults.map((result)=> ({
            submissionId: submission.id,
            testCase: result.testcase,
            passed: result.passed,
            stdout: result.stdout,
            expected: result.expected,
            stderr: result.stderr,
            compileOutput: result.compile_output,
            status: result.status,
            memory: result.memory,
            time: result.time
        }))

        console.log("Testcase results: ", testCaseResults);
        
        await db.testCaseResult.createMany({
            data: testCaseResults
        })
        
        const submissionWithTestCase = await db.submission.findUnique({
            where: {
                id: submission.id
            },
            include: {
                testCases: true
            }
        })
        
        res.status(200).json({
            success: true,
            message: "Code executed! Successfully",
            submission: submissionWithTestCase
        })
        
    } catch (error) {
        console.log("Error in executing code: ", error);
        res.status(500).json({ error: "Failed to execute code" })
    }
}