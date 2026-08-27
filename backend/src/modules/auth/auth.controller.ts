import { FastifyReply, FastifyRequest } from 'fastify';
import { changePasswordSchema, loginSchema } from './auth.schema';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    const user = await authService.authenticate(input);

    const token = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        departmentId: user.departmentId,
        partnerAgencyId: user.partnerAgencyId,
      },
      {
        sign: {
          sub: user.id,
        },
      }
    );

    return reply.status(200).send({
      user,
      token,
    });
  }

  async me(request: FastifyRequest, reply: FastifyReply) {
    const profile = await authService.getProfile(request.user.id);
    return reply.status(200).send(profile);
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const input = changePasswordSchema.parse(request.body);
    const result = await authService.changePassword(request.user.id, input);
    return reply.status(200).send(result);
  }
}
