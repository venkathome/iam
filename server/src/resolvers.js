import { prisma } from './db.js';

export const resolvers = {
  Query: {
    users: () => prisma.user.findMany({ include: { role: true } }),
    user: (_, { id }) => prisma.user.findUnique({ where: { id }, include: { role: true } }),
    roles: () => prisma.role.findMany({ include: { users: true } }),
    role: (_, { id }) => prisma.role.findUnique({ where: { id }, include: { users: true } }),
    recipes: () => prisma.recipe.findMany({ orderBy: { name: 'asc' } }),
    recipe: (_, { id }) => prisma.recipe.findUnique({ where: { id } }),
    searchRecipes: (_, { query }) =>
      prisma.recipe.findMany({
        where: { name: { contains: query } },
        orderBy: { name: 'asc' },
        take: 10,
        select: { id: true, name: true, category: true, cuisine: true, complexity: true },
      }),
  },

  Mutation: {
    createUser: (_, { name, email, roleId }) =>
      prisma.user.create({ data: { name, email, roleId }, include: { role: true } }),

    updateUser: (_, { id, ...data }) =>
      prisma.user.update({ where: { id }, data, include: { role: true } }),

    deleteUser: (_, { id }) =>
      prisma.user.delete({ where: { id }, include: { role: true } }),

    createRole: (_, { name, description }) =>
      prisma.role.create({ data: { name, description }, include: { users: true } }),

    updateRole: (_, { id, ...data }) =>
      prisma.role.update({ where: { id }, data, include: { users: true } }),

    deleteRole: (_, { id }) =>
      prisma.role.delete({ where: { id }, include: { users: true } }),
  },

  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },

  Role: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },

  Recipe: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
};
