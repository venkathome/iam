export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Role {
    id: ID!
    name: String!
    description: String
    users: [User!]!
    createdAt: String!
  }

  type Recipe {
    id: ID!
    name: String!
    category: String!
    cuisine: String!
    ingredients: String!
    instructions: String!
    servings: String
    prepTime: String
    cookTime: String
    complexity: Int!
    imageUrl: String
    createdAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    roles: [Role!]!
    role(id: ID!): Role
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
    searchRecipes(query: String!): [Recipe!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, roleId: String!): User!
    updateUser(id: ID!, name: String, email: String, roleId: String): User!
    deleteUser(id: ID!): User!

    createRole(name: String!, description: String): Role!
    updateRole(id: ID!, name: String, description: String): Role!
    deleteRole(id: ID!): Role!
  }
`;
