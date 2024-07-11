import { ChatVertexAI } from "@langchain/google-vertexai";
import { SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

const model = new ChatVertexAI({
  model: "gemini-1.5-flash",
  temperature: 0
});

// Define the AI_comparison function (assuming it's already implemented)
async function aiCompareSkills(freelancer, project) {
    // Call the AI model to compare the freelancer and project

    const freelancerSkills = freelancer.skills;
    const projectSkills = project.requiredSkills;

    const score = z.object({
        score: z.string().describe("The score that represents how well the freelancer fits the project from 0 to 100")
    });

    const structuredLlm = model.withStructuredOutput(score);

    console.log(await structuredLlm.invoke("compare the freelancer and the project using mainly the skills and give me a score that represents how well the freelancer fits the project. Freelancer skills: {freelancerSkills}. Project skills: {projectSkills}"));

    // return await parser.invoke(result);
}

// Define the function to compare skills
export function compareSkills(freelancer, project) {
    // Extract skills from freelancer and project
    const freelancerSkills = freelancer.skills;
    const projectSkills = project.requiredSkills;

    // Check for common skills
    const commonSkills = freelancerSkills.filter(skill => projectSkills.includes(skill));

    // If there is at least one common skill, call AI_comparison
    if (commonSkills.length > 0) {
        return aiCompareSkills(freelancer, project);
    }
}

// Example usage
const freelancer = {
    name: "John Doe",
    skills: ["JavaScript", "React", "Node.js"]
};

const project = {
    title: "Web Development Project",
    requiredSkills: ["HTML", "CSS", "JavaScript"]
};

compareSkills(freelancer, project);
