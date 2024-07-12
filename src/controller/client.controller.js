import { prisma } from '../lib/index.js';
import { clientSchema, clientUpdateSchema } from '../zod/index.js';
import bcrypt from 'bcrypt';

export default class ClientController {

  async create(req, res) {
    try {
      const { firstName, lastName, email, phone, password } =
        clientSchema.parse(req.body);

      const userExists = await prisma.user.findUnique({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
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
              role: 'CLIENT',
            },
          },
        },
      });

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

    if (!id) {
      return res.status(400).json({ error: 'ID é obrigatório' });
    }

    try {
      const client = await prisma.client.findUnique({
        where: {
          user_id: id,
        },
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && client.user_id !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { firstName, lastName, email, phone, password } =
        clientUpdateSchema.parse(req.body);

      const updateData = {
        firstName,
        lastName,
        email,
        phone,
      };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
      }

      const updatedClient = await prisma.user.update({
        where: {
          id: String(id),
        },
        data: updateData,
      });

      res.status(200).json(updatedClient);
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
      const client = await prisma.client.findUnique({
        where: {
          user_id: id,
        },
      });

      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      if (req.userRole !== 'ADMIN' && client.user_id !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

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
