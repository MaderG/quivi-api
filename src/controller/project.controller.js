import  {prisma}  from '../lib/index.js';
import { projectSchema, projectUpdateSchema } from '../zod/index.js';
import { compareSkills } from '../service/project.service.js';

export default class ProjectController {
  async create(req, res) {
    try {
      const { title, description, budget, deadline } = projectSchema.parse(req.body);
      const client_id = req.userId;

      if (!client_id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          budget,
          deadline,
          client_id,
        },
      });

      const freelancers = await prisma.freelancer.findMany({
        include: { user: true },
      });

      const topFreelancers = await compareSkills(freelancers, project);

      res.status(201).json({ project, topFreelancers });
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

      const projectsWithTopFreelancers = await Promise.all(projects.map(async (project) => {
        let topFreelancers = [];
        if (!project.freelancer) {
          const topFreelancersFromDB = await prisma.projectFreelancerScore.findMany({
            where: { project_id: project.id },
            orderBy: { score: 'desc' },
            include: { freelancer: { include: { user: true } } },
            take: 6,
          });
          topFreelancers = topFreelancersFromDB.map(scoreRecord => ({
            freelancer: scoreRecord.freelancer,
            score: scoreRecord.score,
          }));
        }

        return {
          ...project,
          topFreelancers,
        };
      }));

      res.status(200).json(projectsWithTopFreelancers);
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

      let topFreelancers = [];
      if (!project.freelancer) {
        const topFreelancersFromDB = await prisma.projectFreelancerScore.findMany({
          where: { project_id: project.id },
          orderBy: { score: 'desc' },
          include: { freelancer: { include: { user: true } } },
          take: 6,
        });
        topFreelancers = topFreelancersFromDB.map(scoreRecord => ({
          freelancer: scoreRecord.freelancer,
          score: scoreRecord.score,
        }));
      }

      const projectWithTopFreelancers = {
        ...project,
        topFreelancers,
      };

      res.status(200).json(projectWithTopFreelancers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, description, budget, deadline, client_id, freelancer_id } = projectUpdateSchema.parse(req.body);

    try {
      const project = await prisma.project.findUnique({
        where: { id: String(id) },
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && project.client_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const updateData = {};

      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (budget) updateData.budget = budget;
      if (client_id) updateData.client_id = client_id;
      if (freelancer_id) {
        updateData.freelancer = {
          connect: { user_id: freelancer_id },
        };
      }
      if (deadline) {
        updateData.deadline = new Date(deadline);
      }

      const updatedProject = await prisma.project.update({
        where: { id: String(id) },
        data: updateData,
      });

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const project = await prisma.project.findUnique({
        where: { id: String(id) },
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && project.client_id !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      await prisma.project.delete({ where: { id: String(id) } });

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
}
