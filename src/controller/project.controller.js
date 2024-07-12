import { z } from 'zod';
import { prisma } from '../lib/index.js';
import { projectSchema } from '../zod/index.js';

export default class ProjectController {
  async create(req, res) {
    try {
      const { title, description, budget, deadline, client_id, freelancer_id } =
        projectSchema.parse(req.body);

      const project = await prisma.project.create({
        data: {
          title,
          description,
          budget,
          deadline,
          client_id,
          freelancer_id,
        },
      });

      res.status(201).json(project);
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
    const { title, description, budget, deadline, client_id, freelancer_id } =
      req.body;

    try {
      const project = await prisma.project.update({
        where: {
          id: String(id),
        },
        data: {
          title,
          description,
          budget,
          deadline: deadline ? new Date(deadline) : undefined,
          client_id,
          freelancer_id,
        },
      });

      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
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
