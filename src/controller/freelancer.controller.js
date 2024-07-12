import { prisma } from '../lib/index.js';
import bcrypt from 'bcrypt';
import { authSchema, freelancerSchema } from '../zod/index.js';
import jsonwebtoken from 'jsonwebtoken';


export default class FreelancerController {
  async authenticate(req, res) {
    try {
      const { email, password } = authSchema.parse(req.body);
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          freelancer: true,
        },
      });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (user.freelancer === null) {
        throw new Error('Usuário não é freelancer');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Senha inválida');
      }

      delete user.password;

      const jwt = await jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      res.status(200).json({ jwt });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { firstName, lastName, email, phone, password, skills } =
        freelancerSchema.parse(req.body);

      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        throw new Error('Email já cadastrado');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const freelancer = await prisma.freelancer.create({
        data: {
          user: {
            create: {
              firstName: firstName,
              lastName: lastName,
              email,
              phone,
              password: hashedPassword,
            },
          },
          skills,
        },
      });

      delete freelancer.user.password;
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
      const { firstName, lastName, email, phone, password, skills } =
        freelancerSchema.parse(req.body);

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
