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

  type Ingredient {
    name: String!
    quantity: String
  }

  input IngredientInput {
    name: String!
    quantity: String
  }

  type Recipe {
    id: ID!
    name: String!
    category: String!
    cuisine: String!
    ingredients: [Ingredient!]!
    instructions: String!
    servings: String
    prepTime: String
    cookTime: String
    complexity: Int!
    imageUrl: String
    createdAt: String!
  }

  type Spelling {
    id: ID!
    word: String!
    definition: String
    speltCount: Int!
    needsRevision: Boolean!
    createdAt: String!
  }

  type Profile {
    id: ID!
    firstName: String!
    lastName: String
    dateOfBirth: String
    email: String
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
    spellings(profileId: ID!): [Spelling!]!
    searchSpellings(profileId: ID!, query: String!): [Spelling!]!
    profiles: [Profile!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, roleId: String!): User!
    updateUser(id: ID!, name: String, email: String, roleId: String): User!
    deleteUser(id: ID!): User!

    createRole(name: String!, description: String): Role!
    updateRole(id: ID!, name: String, description: String): Role!
    deleteRole(id: ID!): Role!

    createRecipe(
      name: String!
      category: String!
      cuisine: String!
      ingredients: [IngredientInput!]!
      instructions: String!
      servings: String
      prepTime: String
      cookTime: String
      complexity: Int
      imageUrl: String
    ): Recipe!

    updateRecipe(
      id: ID!
      name: String
      category: String
      cuisine: String
      ingredients: [IngredientInput!]
      instructions: String
      servings: String
      prepTime: String
      cookTime: String
      complexity: Int
      imageUrl: String
    ): Recipe!

    deleteRecipe(id: ID!): Recipe!

    createProfile(firstName: String!, lastName: String, dateOfBirth: String, email: String): Profile!
    deleteProfile(id: ID!): Profile!

    addSpelling(profileId: ID!, word: String!, definition: String): Spelling!
    incrementSpeltCount(id: ID!): Spelling!
    decrementSpeltCount(id: ID!): Spelling!
    toggleRevision(id: ID!): Spelling!
    deleteSpelling(id: ID!): Spelling!
  }
`;
