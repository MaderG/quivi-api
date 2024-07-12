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
  bio: z.string().optional(),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  budget: z.number().int().positive(),
  deadline: z.string().transform((str) => new Date(str)),
  freelancer_id: z.string().uuid().optional(),
  requiredSkills: z
    .array(z.string())
    .nonempty('Pelo menos uma habilidade é necessária'),
});

export const clientUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const freelancerUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
});

export const projectUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  budget: z.number().int().positive().optional(),
  deadline: z.string().transform((str) => new Date(str)).optional(),
  requiredSkills: z.array(z.string()).nonempty().optional(),
  freelancer_id: z.string().uuid().optional(),
});

export const adminSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});