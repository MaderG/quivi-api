import { prisma } from '../lib/index.js';
import { clientSchema } from '../zod/index.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

export default class ClientController {
  async authenticate(req, res) {
    try {
      const { email, password } = clientSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          client: true,
        },
      });

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (user.client === null) {
        throw new Error('Usuário não é cliente');
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
      const { firstName, lastName, email, phone, password } =
        clientSchema.parse(req.body);

      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        throw new Error('Email já cadastrado');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const client = await prisma.client.create({
        data: {
          user: {
            create: {
              firstName,
              lastName,
              email,
              phone,
              password: hashedPassword,
            },
          },
        },
      });

      delete client.user.password;
      res.status(201).send(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    try {
      const clients = await prisma.user.findMany({
        where: {
          client: {
            isNot: null,
          },
        },
        include: {
          client: true,
        },
      });
      res.status(200).send(clients);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;
    try {
      const client = await prisma.user.findUnique({
        where: {
          id: String(id),
        },
        include: {
          client: true,
        },
      });

      if (!client || !client.client) {
        return res.status(404).send();
      }

      res.status(200).send(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    try {
      const client = await prisma.user.update({
        where: {
          id: String(id),
        },
        data: {
          name,
          email,
          phone,
          password,
        },
        include: {
          client: true,
        },
      });

      res.status(200).send(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await prisma.user.delete({
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
