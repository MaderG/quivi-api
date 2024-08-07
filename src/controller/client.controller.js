import { z } from 'zod';
import { prisma } from "../lib/index.js";

const clientSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6),
});

export default class ClientController {
    async create(req, res) {
        try {
            const { firstName, lastName, email, phone, password } = clientSchema.parse(req.body);

            const client = await prisma.client.create({
                data: {
                    user: {
                        create: {
                            firstName,
                            lastName,
                            email,
                            phone,
                            password
                        }
                    }
                }
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
