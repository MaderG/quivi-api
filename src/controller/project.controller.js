import { prisma } from '../lib/index.js';
import { projectSchema } from '../zod/index.js';
import { compareSkills } from '../utils/match.js';

export default class ProjectController {
  async create(req, res) {
    try {
      const { title, description, budget, deadline, client_id, requiredSkills } = projectSchema.parse(req.body);

      const project = await prisma.project.create({
        data: {
          title,
          description,
          budget,
          deadline,
          client_id,
          requiredSkills,
        },
      });


      const freelancers = await prisma.freelancer.findMany({
        include: { user: true },
      });

      const { bestMatch, highestScore } = await compareSkills(freelancers, project);

      if (bestMatch) {

        console.log('Best Match:', bestMatch);
        console.log('Score:', highestScore);
      }

      res.status(201).json({ project, bestMatch, highestScore });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    try {
      const projects = await prisma.project.findMany({
        include: {
          client: true,
          freelancer: true,
        },
      });
      res.status(200).json(projects);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const project = await prisma.project.findUnique({
        where: {
          id: String(id),
        },
        include: {
          client: true,
          freelancer: true,
        },
      });

      if (!project) {
        return res.status(404).send();
      }

      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, budget, deadline, client_id, freelancer_id } = projectSchema.parse(req.body);

    try {
      const project = await prisma.project.findUnique({
        where: {
          id: String(id),
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && project.client_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updateData = {
        title,
        description,
        budget,
        client_id,
        freelancer_id,
      };

      if (deadline) {
        updateData.deadline = new Date(deadline);
      }

      const updatedProject = await prisma.project.update({
        where: {
          id: String(id),
        },
        data: updateData,
      });

      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const project = await prisma.project.findUnique({
        where: {
          id: String(id),
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && project.client_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await prisma.project.delete({
        where: {
          id: String(id),
        },
      });

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}