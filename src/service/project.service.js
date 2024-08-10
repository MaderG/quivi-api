import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { prisma } from '../lib/index.js';

// const prompt = `You are an expert in analyzing project requirements and evaluating the skillset of freelancers. Your task is to compare the project description with the freelancer's skills and generate a compatibility score from 0 to 100.

// **Step 1:** Analyze the project description to identify the key skills, experience, and tools required to successfully complete the project.

// **Step 2:** Compare the identified skills from the project description with the provided freelancer skills. Consider the relevance, depth of experience, and proficiency with required tools or software.

// **Step 3:** Generate a compatibility score from 0 to 100 based on how well the freelancer's skills match the project requirements. Provide a brief explanation for the score.

// **Input:**

// - Project Description: ${project.description}
// - Freelancer Skills: ${freelancer.skills}
// - Freelancer Bio: ${freelancer.bio}
// `
 
const model = new ChatOpenAI({ model: 'gpt-4o-mini' });
 
async function aiCompareSkills(freelancer, project) {
  const scoreSchema = z.object({
    score: z.string().describe('Only the number of the score that represents how well the freelancer fits the project from 0 to 100'),
    explanation: z.string().describe('Brief Explanation of the Score')
  });
 
  const structuredLlm = model.withStructuredOutput(scoreSchema);
 
  const response = await structuredLlm.invoke(`You are an expert in analyzing project requirements and evaluating the skillset of freelancers. Your task is to compare the project description with the freelancer's skills and generate a compatibility score from 0 to 100.

**Step 1:** Analyze the project description to identify the key skills, experience, and tools required to successfully complete the project.

**Step 2:** Compare the identified skills from the project description with the provided freelancer skills. Consider the relevance, depth of experience, and proficiency with required tools or software.

**Step 3:** Generate a compatibility score from 0 to 100 based on how well the freelancer's skills match the project requirements. Provide a brief explanation for the score.

**Input:**

- Project Description: ${project.description}
- Freelancer Skills: ${freelancer.skills}
- Freelancer Bio: ${freelancer.bio}
`);
 
  return response;
}

export async function compareSkills(freelancers, project) {

  const scores = await Promise.all(
    freelancers.map(async (freelancer) => {
      // Verificar se a pontuação já existe no banco de dados
      let existingScore = await prisma.projectFreelancerScore.findUnique({
        where: {
          project_id_freelancer_id: {
            project_id: project.id,
            freelancer_id: freelancer.user_id,
          },
        },
      });

      // Se não existir, calcular a pontuação e salvar no banco de dados
      if (!existingScore) {
        const matchResult = await aiCompareSkills(freelancer, project);
        const score = parseInt(matchResult.score, 10);
        
        existingScore = await prisma.projectFreelancerScore.create({
          data: {
            project_id: project.id,
            freelancer_id: freelancer.user_id,
            score,
          },
        });
      }

      return { freelancer, score: existingScore.score };
    })
  );

  scores.sort((a, b) => b.score - a.score);
  const topScores = scores.slice(0, 6);

  return topScores;
}