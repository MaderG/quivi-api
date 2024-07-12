import { z } from 'zod';

export const clientSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export const authSchema = z.object({
  email: z.string().email('O email deve ser válido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export const freelancerSchema = z.object({
  firstName: z.string('O primeiro nome é obrigatório'),
  lastName: z.string('O sobrenome é obrigatório'),
  email: z.string().email('O email deve ser válido'),
  phone: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  skills: z.array(z.string()),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  budget: z.number().int().positive(),
  deadline: z.string().transform((str) => new Date(str)),
  client_id: z.string().uuid(),
  freelancer_id: z.string().uuid().optional(),
});
