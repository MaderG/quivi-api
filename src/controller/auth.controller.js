import { prisma } from '../lib/index.js'
import { authSchema } from '../zod/index.js';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

export default class AuthController {
  async authenticate(req, res) {
    try {
      const { email, password } = authSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: {
          email,
        }
      });


      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const jwt = await jsonwebtoken.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        }
      );
      res.status(200).json({ jwt });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
