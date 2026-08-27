import { Role } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      role: Role;
      departmentId?: string | null;
      partnerAgencyId?: string | null;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      role: Role;
      departmentId?: string | null;
      partnerAgencyId?: string | null;
    };
  }
}
