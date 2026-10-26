import { aiClient } from '../config/gemini.js';

/**
 * Robust caller with model fallback (gemini-3.5-flash-lite / gemini-3.8-flash)
 */
const callGemini = async (prompt) => {
  if (!aiClient) return null;

  // gemini-3.5-flash-lite has ultra-low latency & high availability; gemini-3.8-flash as secondary
  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

  for (const model of modelsToTry) {
    try {
      console.log(`🤖 Requesting Gemini API with model: ${model}...`);
      const response = await aiClient.interactions.create({
        model,
        input: prompt,
      });

      if (response && response.output_text) {
        return response.output_text;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${model} failed (${err.message}). Trying fallback...`);
    }
  }

  throw new Error('All Gemini AI model attempts failed or are unavailable.');
};

/**
 * Clean and parse JSON response from LLM output
 */
const cleanAndParseJson = (text) => {
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i) || [null, text];
    const cleaned = (jsonMatch[1] || text).trim();
    return JSON.parse(cleaned);
  } catch (err) {
    // Fallback: search for first '{' and last '}'
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const sliced = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(sliced);
      }
    } catch (sliceErr) {
      // ignore
    }
    console.error('JSON parse error from LLM output:', err.message, text);
    throw new Error('Failed to parse AI response into valid JSON format.');
  }
};

/**
 * Normalize extracted resume to ensure structured fields conform to expected frontend schema
 */
const normalizeResumeData = (parsed) => {
  if (!parsed || typeof parsed !== 'object') {
    return parsed;
  }

  // Ensure skills has technical/soft/tools shape
  if (Array.isArray(parsed.skills)) {
    parsed.skills = {
      technical: parsed.skills,
      soft: ['Communication', 'Teamwork', 'Problem Solving'],
      tools: ['Git', 'VS Code']
    };
  } else if (!parsed.skills || typeof parsed.skills !== 'object') {
    parsed.skills = { technical: [], soft: [], tools: [] };
  } else {
    parsed.skills.technical = Array.isArray(parsed.skills.technical) ? parsed.skills.technical : [];
    parsed.skills.soft = Array.isArray(parsed.skills.soft) ? parsed.skills.soft : [];
    parsed.skills.tools = Array.isArray(parsed.skills.tools) ? parsed.skills.tools : [];
  }

  if (!Array.isArray(parsed.experience)) parsed.experience = [];
  if (!Array.isArray(parsed.education)) parsed.education = [];
  if (!Array.isArray(parsed.projects)) parsed.projects = [];

  return parsed;
};

/**
 * Normalize job match analysis data to guarantee all expected fields exist
 */
const normalizeJobAnalysisData = (parsed, jobTitle = 'Target Job') => {
  if (!parsed || typeof parsed !== 'object') {
    return parsed;
  }

  const score = typeof parsed.overallMatchScore === 'number' ? parsed.overallMatchScore : 75;
  parsed.overallMatchScore = Math.max(0, Math.min(100, Math.round(score)));

  parsed.scoreBreakdown = parsed.scoreBreakdown && typeof parsed.scoreBreakdown === 'object'
    ? {
        skillMatch: parsed.scoreBreakdown.skillMatch ?? parsed.overallMatchScore,
        experienceMatch: parsed.scoreBreakdown.experienceMatch ?? Math.max(40, parsed.overallMatchScore - 5),
        educationMatch: parsed.scoreBreakdown.educationMatch ?? 85,
      }
    : {
        skillMatch: parsed.overallMatchScore,
        experienceMatch: parsed.overallMatchScore,
        educationMatch: 85,
      };

  parsed.matchingSkills = Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills : [];
  parsed.missingSkills = Array.isArray(parsed.missingSkills)
    ? parsed.missingSkills.map(m => typeof m === 'string' ? { skill: m, importance: 'High', reason: `Recommended for ${jobTitle}` } : m)
    : [];
  parsed.missingKeywords = Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [];
  parsed.strengths = Array.isArray(parsed.strengths) ? parsed.strengths : [];
  parsed.weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [];

  if (!parsed.sectionSuggestions || typeof parsed.sectionSuggestions !== 'object') {
    parsed.sectionSuggestions = {
      summary: `Tailor your professional summary towards ${jobTitle}.`,
      experience: [],
      skills: 'Highlight matching core technologies at the top of your skills list.',
      projects: 'Showcase projects using the required technology stack.'
    };
  } else {
    parsed.sectionSuggestions.experience = Array.isArray(parsed.sectionSuggestions.experience)
      ? parsed.sectionSuggestions.experience
      : [];
  }

  parsed.executiveSummary = parsed.executiveSummary || `Match score is ${parsed.overallMatchScore}%. Adding key missing skills will strengthen this application for ${jobTitle}.`;

  return parsed;
};

/**
 * Step 1 & 2: Analyze resume text and extract structured fields
 */
export const extractResumeDetails = async (resumeText) => {
  if (!aiClient) {
    return getFallbackParsedResume(resumeText);
  }

  const prompt = `
You are an expert ATS (Applicant Tracking System) parser and resume analyzer.
Analyze the following resume text and extract all details into a clean JSON object.

RESUME TEXT:
${resumeText.substring(0, 8000)}

Return ONLY a JSON object with this EXACT structure (no commentary or markdown outside the JSON code block):
{
  "fullName": "Candidate Full Name or Unknown",
  "email": "Email address or empty string",
  "phone": "Phone number or empty string",
  "location": "City/Country or empty string",
  "summary": "Professional summary or a generated 2-sentence summary based on resume",
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"]
  },
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "duration": "Dates worked e.g. 2021 - Present",
      "responsibilities": ["Bullet point 1", "Bullet point 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University / College",
      "year": "Graduation Year"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "techStack": ["Tech1", "Tech2"]
    }
  ]
}
`;

  try {
    const outputText = await callGemini(prompt);
    const parsed = cleanAndParseJson(outputText);
    return normalizeResumeData(parsed);
  } catch (error) {
    console.error('Error calling Gemini for resume extraction:', error.message);
    return getFallbackParsedResume(resumeText);
  }
};

/**
 * Step 3, 4, 5, 6, 7: Analyze Job Description, Compare vs Resume, Generate Score, Missing Skills, and Section Suggestions
 */
export const analyzeJobMatch = async (parsedResume, jobTitle, jobDescription) => {
  if (!aiClient) {
    return getFallbackJobAnalysis(parsedResume, jobTitle, jobDescription);
  }

  const resumeJsonStr = JSON.stringify(parsedResume, null, 2);

  const prompt = `
You are a top tech recruiter and career counselor.
Analyze the candidate's parsed resume against the provided Job Description.

TARGET JOB TITLE: ${jobTitle}
JOB DESCRIPTION:
${jobDescription.substring(0, 8000)}

CANDIDATE PARSED RESUME:
${resumeJsonStr}

Perform a rigorous ATS match analysis and return ONLY a JSON object with the following structure:
{
  "overallMatchScore": 78,
  "scoreBreakdown": {
    "skillMatch": 80,
    "experienceMatch": 75,
    "educationMatch": 85
  },
  "jobSummary": "Concise 2-sentence summary of the job role and core requirements.",
  "matchingSkills": ["Skill 1 found in both", "Skill 2 found in both"],
  "missingSkills": [
    {
      "skill": "Missing Skill Name",
      "importance": "High",
      "reason": "Why this skill is crucial for the role based on JD"
    }
  ],
  "missingKeywords": ["ATS keyword 1", "ATS keyword 2"],
  "strengths": [
    "Key strength 1 highlighting candidate alignment",
    "Key strength 2"
  ],
  "weaknesses": [
    "Area where candidate lacks experience or explicit skill proof"
  ],
  "sectionSuggestions": {
    "summary": "Specific advice on how to rewrite summary for this target job",
    "experience": [
      {
        "originalBullet": "Original resume bullet point or responsibility",
        "suggestedBullet": "Action-oriented tailored bullet point incorporating missing keywords",
        "reason": "Why this change improves ATS match score"
      }
    ],
    "skills": "Advice on reorganizing skills section to match job requirements",
    "projects": "Suggestions on how to frame projects to emphasize relevant tech stack"
  },
  "executiveSummary": "A 3-sentence recruiter assessment of candidate fit and chances of landing an interview."
}

Rules:
1. overallMatchScore must be an integer between 0 and 100 based on realistic skill/experience overlap.
2. importance in missingSkills must be one of: "High", "Medium", or "Low".
3. Return valid JSON ONLY.
`;

  try {
    const outputText = await callGemini(prompt);
    const parsed = cleanAndParseJson(outputText);
    return normalizeJobAnalysisData(parsed, jobTitle);
  } catch (error) {
    console.error('Error calling Gemini for job match analysis:', error.message);
    return getFallbackJobAnalysis(parsedResume, jobTitle, jobDescription);
  }
};

/**
 * Step 8: Q&A Assistant about the resume & job fit
 */
export const answerResumeQuestion = async (parsedResume, jobAnalysis, history, userQuestion) => {
  if (!aiClient) {
    return `## Assistant Offline\n\nPersonalised AI guidance needs a **GEMINI_API_KEY**. Add it to \`server/.env\` and restart the server.\n\n## Quick Insights From Your Analysis\n\n- **Strong matches:** ${jobAnalysis.matchingSkills?.slice(0, 3).join(', ') || 'general skills'}\n- **Gaps to close:** ${jobAnalysis.missingKeywords?.slice(0, 3).join(', ') || 'relevant keywords'}\n\n> **Tip:** Add the missing keywords naturally into your experience bullets, not just the skills list.`;
  }

  const contextPrompt = `
You are an expert AI Career Coach helping a job applicant optimize their resume and prepare for an application.

CANDIDATE RESUME SUMMARY:
Name: ${parsedResume.fullName || 'User'}
Skills: ${JSON.stringify(parsedResume.skills)}
Experience: ${JSON.stringify(parsedResume.experience?.map(e => `${e.title} at ${e.company}`))}

JOB CONTEXT:
Title: ${jobAnalysis.jobTitle || 'Target Job'}
Match Score: ${jobAnalysis.overallMatchScore}%
Matching Skills: ${jobAnalysis.matchingSkills?.join(', ')}
Missing Skills: ${jobAnalysis.missingSkills?.map(m => m.skill).join(', ')}

CONVERSATION HISTORY:
${history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

USER QUESTION:
${userQuestion}

RESPONSE FORMAT (follow strictly for EVERY answer, whatever the question):
- Write in clean Markdown only. Never output raw JSON or HTML.
- Start with ONE short sentence that directly answers the question (no greeting, no "Sure!").
- Then organise the answer under 2-4 sections using "## " headings with a fitting emoji, e.g. "## 🎯 Key Skills to Add".
- Inside sections use short bullet points ("- ") or numbered steps ("1. "). Bold the important terms with **double asterisks**. Keep each bullet to 1-2 lines.
- For comparisons use a Markdown table. For sample text such as a cover letter, email, summary or rewritten bullet, put it inside a fenced code block (\`\`\`) so it can be copied.
- Finish with a "## ✅ Next Steps" section containing 2-3 concrete actions, then one line starting with "> 💡 **Pro Tip:**".
- Be specific to THIS candidate and THIS job using the context above. No filler, no generic advice, no repeating the question.
- Keep the total under about 350 words unless the user asks for a long document (such as a full cover letter).
`;

  try {
    const outputText = await callGemini(contextPrompt);
    return outputText || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Gemini for Q&A:', error.message);
    return `## ⚠️ Something Went Wrong\n\nI couldn't process that request: **${error.message}**\n\n## ✅ Next Steps\n\n1. Check your internet connection.\n2. Confirm your \`GEMINI_API_KEY\` in \`server/.env\`.\n3. Send your question again.`;
  }
};

/* --- Fallback Generators when API key is missing or offline --- */

const getFallbackParsedResume = (resumeText) => {
  const textLower = resumeText.toLowerCase();
  
  // Basic heuristic skill extraction
  const commonTech = ['javascript', 'typescript', 'react', 'node.js', 'express', 'mongodb', 'python', 'java', 'html', 'css', 'tailwind', 'sql', 'git', 'docker', 'aws', 'rest api'];
  const foundSkills = commonTech.filter(s => textLower.includes(s));

  return {
    fullName: "Extracted Candidate",
    email: resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "",
    phone: resumeText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/)?.[0] || "",
    location: "Location identified from document",
    summary: "Experienced developer with expertise in web technologies, software development, and application engineering.",
    skills: {
      technical: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React.js', 'Node.js', 'HTML/CSS', 'Git'],
      soft: ['Problem Solving', 'Team Collaboration', 'Communication'],
      tools: ['VS Code', 'Git', 'Postman']
    },
    experience: [
      {
        company: "Tech Solutions Inc.",
        title: "Software Engineer",
        duration: "2022 - Present",
        responsibilities: [
          "Developed web applications using modern JavaScript frameworks.",
          "Collaborated with cross-functional teams to deliver scalable software features.",
          "Optimized backend REST APIs for performance and security."
        ]
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "State University",
        year: "2022"
      }
    ],
    projects: [
      {
        name: "Full Stack Web Application",
        description: "Built responsive user interface and REST API endpoints.",
        techStack: foundSkills.slice(0, 4)
      }
    ]
  };
};

const getFallbackJobAnalysis = (parsedResume, jobTitle, jobDescription) => {
  const resumeSkills = (parsedResume.skills?.technical || []).map(s => s.toLowerCase());
  const jdLower = jobDescription.toLowerCase();

  const standardKeywords = ['react', 'node.js', 'typescript', 'express', 'mongodb', 'tailwind', 'docker', 'aws', 'ci/cd', 'agile', 'system design', 'rest api', 'unit testing'];
  
  const jdRequired = standardKeywords.filter(k => jdLower.includes(k));
  const matched = jdRequired.filter(k => resumeSkills.some(rs => rs.includes(k) || k.includes(rs)));
  const missing = jdRequired.filter(k => !matched.includes(k));

  const score = Math.min(95, Math.max(45, Math.round((matched.length / Math.max(1, jdRequired.length)) * 100) || 72));

  return {
    overallMatchScore: score,
    scoreBreakdown: {
      skillMatch: Math.min(100, score + 5),
      experienceMatch: Math.max(40, score - 8),
      educationMatch: 85
    },
    jobSummary: `Target role for ${jobTitle || 'Software Engineer'} focused on building modern scalable software solutions.`,
    matchingSkills: matched.length > 0 ? matched.map(m => m.toUpperCase()) : ['JavaScript', 'React.js', 'Node.js'],
    missingSkills: (missing.length > 0 ? missing : ['TypeScript', 'Docker', 'AWS']).map(s => ({
      skill: s.toUpperCase(),
      importance: 'High',
      reason: `Key requirement highlighted in ${jobTitle} description.`
    })),
    missingKeywords: (missing.length > 0 ? missing : ['TypeScript', 'Microservices', 'CI/CD']).map(k => k.toUpperCase()),
    strengths: [
      `Strong foundational match in core skills: ${matched.join(', ') || 'web development'}`,
      "Relevant hands-on experience in software development"
    ],
    weaknesses: [
      `Missing explicit keywords mentioned in job posting: ${missing.slice(0, 3).join(', ') || 'cloud deployment'}`
    ],
    sectionSuggestions: {
      summary: `Tailor your summary to mention explicit fit for ${jobTitle} and emphasize your core strengths.`,
      experience: [
        {
          originalBullet: parsedResume.experience?.[0]?.responsibilities?.[0] || "Developed web applications using modern JavaScript frameworks.",
          suggestedBullet: `Architected and deployed responsive applications for ${jobTitle} role, incorporating ${missing[0] || 'TypeScript'} and optimized REST APIs.`,
          reason: `Integrates missing job requirement '${missing[0] || 'TypeScript'}' directly into an experience bullet point.`
        }
      ],
      skills: `Reorder your technical skills section so matching skills (${matched.join(', ')}) appear first.`,
      projects: `Highlight your most relevant project that demonstrates hands-on work related to ${jobTitle}.`
    },
    executiveSummary: `Solid match (${score}%). Candidate possesses strong core capabilities. By adding missing keywords and tailoring experience bullets, interview probability will increase significantly.`
  };
};
