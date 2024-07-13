import { ChatVertexAI } from '@langchain/google-vertexai';
import { z } from 'zod';

const model = new ChatVertexAI({
  model: 'gemini-1.5-flash',
  temperature: 0,
});

async function aiCompareSkills(freelancer, project) {
  const scoreSchema = z.object({
    score: z.string().describe('The score that represents how well the freelancer fits the project from 0 to 100'),
  });

  const structuredLlm = model.withStructuredOutput(scoreSchema);

  const response = await structuredLlm.invoke(
    `compare the freelancer and the project using mainly the skills and give me a score that represents how well the freelancer fits the project. Freelancer skills: ${freelancer.skills}. Project skills: ${project.requiredSkills}`
  );

  return response;
}

export async function compareSkills(freelancers, project) {
  const projectSkills = project.requiredSkills;

  // Filtragem inicial de freelancers que possuem habilidades em comum
  const filteredFreelancers = freelancers.filter(freelancer => {
    const commonSkills = freelancer.skills.filter(skill => projectSkills.includes(skill));
    return commonSkills.length > 0;
  });

  // Limitar a lista de freelancers para 5 a 10
  const limitedFreelancers = filteredFreelancers.slice(0, 10);

  let bestMatch = null;
  let highestScore = 0;

  // Avaliar cada freelancer filtrado usando a IA
  for (const freelancer of limitedFreelancers) {
    const matchResult = await aiCompareSkills(freelancer, project);
    const score = parseInt(matchResult.score, 10);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = freelancer;
    }
  }

  return { bestMatch, highestScore };
}
