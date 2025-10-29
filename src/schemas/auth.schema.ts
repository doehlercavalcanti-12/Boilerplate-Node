import { Type } from '@sinclair/typebox';

export const loginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 12 })
});

export type LoginBody = {
  email: string;
  password: string;
};

export const loginSchema = {
  body: loginBodySchema,
  response: {
    200: Type.Object({
      accessToken: Type.String(),
      expiresIn: Type.Number(),
      user: Type.Object({
        id: Type.String(),
        email: Type.String({ format: 'email' }),
        roles: Type.Array(Type.String())
      })
    })
  },
  tags: ['Auth'],
  summary: 'Authenticate user via email/password'
};
