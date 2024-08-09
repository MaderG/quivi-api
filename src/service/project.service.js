import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import { prisma } from '../lib/index.js';

const model = new ChatOpenAI({ model: 'gpt-4o-mini' });

async function aiCompareSkills(freelancer, project) {
  const scoreSchema = z.object({
    score: z.string().describe('Only the number of the score that represents how well the freelancer fits the project from 0 to 100'),
  });

  const structuredLlm = model.withStructuredOutput(scoreSchema);

  const response = await structuredLlm.invoke(
    `compare the freelancer and the project using mainly the skills and give me a score that represents how well the freelancer fits the project. Freelancer skills: ${freelancer.skills}. Project skills: ${project.requiredSkills}`
  );

  return response;
}

export async function compareSkills(freelancers, project) {
  const projectSkills = project.requiredSkills;

  const filteredFreelancers = freelancers.filter(freelancer => {
    const commonSkills = freelancer.skills.filter(skill => projectSkills.includes(skill));
    return commonSkills.length > 0;
  });

  const limitedFreelancers = filteredFreelancers.slice(0, 10);

  const scores = await Promise.all(
    limitedFreelancers.map(async (freelancer) => {
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