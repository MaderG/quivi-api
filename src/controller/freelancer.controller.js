import { prisma } from '../lib/index.js';
import bcrypt from 'bcrypt';
import { freelancerSchema, freelancerUpdateSchema } from '../zod/index.js';

export default class FreelancerController {

  async create(req, res) {
    try {
      const { firstName, lastName, email, phone, password, skills, bio } =
        freelancerSchema.parse(req.body);

      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const freelancer = await prisma.freelancer.create({
        data: {
          user: {
            create: {
              firstName,
              lastName,
              email,
              phone,
              password: hashedPassword,
              role: 'FREELANCER',
            },
          },
          skills,
          bio,
        },
      });

      res.status(201).json(freelancer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    try {
      const freelancers = await prisma.user.findMany({
        where: {
          freelancer: {
            isNot: null,
          },
        },
        include: {
          freelancer: true,
        },
      });
      res.status(200).json(freelancers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const freelancer = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
        include: {
          freelancer: true,
        },
      });
      res.status(200).json(freelancer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID é obrigatório' });
    }

    try {
      const freelancer = await prisma.freelancer.findUnique({
        where: {
          user_id: id,
        },
      });

      if (!freelancer) {
        return res.status(404).json({ error: 'Freelancer não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && freelancer.user_id !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { firstName, lastName, email, phone, password, skills } =
        freelancerUpdateSchema.parse(req.body);

      const updateData = {
        user: {
          update: {
            firstName,
            lastName,
            email,
            phone,
          },
        },
        skills: {
          set: skills,
        },
      };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.user.update.password = hashedPassword;
      }

      const updatedFreelancer = await prisma.freelancer.update({
        where: {
          user_id: id,
        },
        data: updateData,
      });

      res.status(200).json(updatedFreelancer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID é obrigatório' });
    }

    try {
      const freelancer = await prisma.freelancer.findUnique({
        where: {
          user_id: id,
        },
      });

      if (!freelancer) {
        return res.status(404).json({ error: 'Freelancer não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && freelancer.user_id !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      await prisma.freelancer.delete({
        where: {
          user_id: id,
        },
      });

      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}