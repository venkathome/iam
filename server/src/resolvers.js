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
    profiles: () => prisma.profile.findMany({ orderBy: { firstName: 'asc' } }),
    spellings: (_, { profileId }) =>
      prisma.spelling.findMany({ where: { profileId }, orderBy: { word: 'asc' } }),
    searchSpellings: (_, { profileId, query }) =>
      prisma.spelling.findMany({
        where: { profileId, word: { contains: query } },
        orderBy: { word: 'asc' },
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

    createRecipe: (_, { complexity, ingredients, ...rest }) =>
      prisma.recipe.create({
        data: { ...rest, ingredients: JSON.stringify(ingredients), complexity: complexity ?? 1 },
      }),

    updateRecipe: (_, { id, ingredients, ...data }) => {
      const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
      if (ingredients !== undefined) clean.ingredients = JSON.stringify(ingredients)
      return prisma.recipe.update({ where: { id }, data: clean })
    },

    deleteRecipe: (_, { id }) =>
      prisma.recipe.delete({ where: { id } }),

    createProfile: (_, { firstName, lastName, dateOfBirth, email }) =>
      prisma.profile.create({ data: { firstName, lastName, dateOfBirth, email } }),

    updateProfile: (_, { id, firstName, lastName, dateOfBirth, email }) =>
      prisma.profile.update({ where: { id }, data: { firstName, lastName, dateOfBirth, email } }),

    deleteProfile: (_, { id }) => prisma.profile.delete({ where: { id } }),

    addSpelling: (_, { profileId, word, definition }) =>
      prisma.spelling.create({ data: { profileId, word: word.toLowerCase(), definition } }),

    incrementSpeltCount: (_, { id }) =>
      prisma.spelling.update({ where: { id }, data: { speltCount: { increment: 1 } } }),

    decrementSpeltCount: async (_, { id }) => {
      const { speltCount } = await prisma.spelling.findUnique({ where: { id }, select: { speltCount: true } })
      return prisma.spelling.update({ where: { id }, data: { speltCount: Math.max(0, speltCount - 1) } })
    },

    toggleRevision: async (_, { id }) => {
      const { needsRevision } = await prisma.spelling.findUnique({ where: { id }, select: { needsRevision: true } })
      return prisma.spelling.update({ where: { id }, data: { needsRevision: !needsRevision } })
    },

    deleteSpelling: (_, { id }) =>
      prisma.spelling.delete({ where: { id } }),
  },

  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    updatedAt: (parent) => parent.updatedAt.toISOString(),
  },

  Role: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },

  Profile: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },

  Spelling: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },

  Recipe: {
    createdAt: (parent) => parent.createdAt.toISOString(),
    ingredients: (parent) => {
      try {
        const parsed = JSON.parse(parent.ingredients || '[]')
        return parsed.map(item =>
          typeof item === 'string' ? { name: item, quantity: null } : item
        )
      } catch {
        return []
      }
    },
  },
};
