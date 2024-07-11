import { z } from "zod";
import { prisma } from "../lib";

const freelancerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  skills: z.array(z.string()),
});

export default class FreelancerController {
  async create(req, res) {
    try {
      const { firstName, lastName, email, phone, password, skills } = freelancerSchema.parse(req.body);

      const freelancer = await prisma.freelancer.create({
        data: {
          user: {
            create: {
              name: `${firstName} ${lastName}`,
              email,
              phone,
              password,
            },
          },
          skills,
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
    try {
      const { firstName, lastName, email, phone, password, skills } = freelancerSchema.parse(req.body);

      const freelancer = await prisma.freelancer.update({
        where: {
          userId: id,
        },
        data: {
          user: {
            update: {
              name: `${firstName} ${lastName}`,
              email,
              phone,
              password,
            },
          },
          skills: {
            set: skills,
          },
        },
      });

      res.status(200).json(freelancer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await prisma.freelancer.delete({
        where: {
          userId: id,
        },
      });
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
