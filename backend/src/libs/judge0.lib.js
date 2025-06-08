import axios from "axios"

export const getJudge0LanguageId = (language)=>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[language.toUpperCase()]
}

const sleep  = (ms)=> new Promise((resolve)=> setTimeout(resolve , ms))

export const pollBatchResults = async (tokens)=>{
    while(true){
        console.log("My judge0 api url: ", process.env.JUDGE0_API_URL);
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        console.log("Data from poll batch: ", data);
        
        const results = data.submissions;

        const isAllDone = results.every(
            (r)=> r.status.id !== 1 && r.status.id !== 2
        )
        console.log("reached here")
        
        if(isAllDone) return results
        await sleep(1000)
    }
}

export const submitBatch = async (submissions)=>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("Submission Results: ", data)

    return data // [{token} , {token} , {token}]
}


export function getLanguageName(languageId){
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
    }

    return LANGUAGE_NAMES[languageId] || "Unknown"
}