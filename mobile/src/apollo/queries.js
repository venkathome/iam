import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      createdAt
      role {
        id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
      role {
        id
        name
        description
      }
    }
  }
`;

export const GET_ROLES = gql`
  query GetRoles {
    roles {
      id
      name
      description
      createdAt
      users {
        id
        name
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $roleId: String!) {
    createUser(name: $name, email: $email, roleId: $roleId) {
      id
      name
      email
      role {
        id
        name
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $roleId: String) {
    updateUser(id: $id, name: $name, email: $email, roleId: $roleId) {
      id
      name
      email
      role {
        id
        name
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation CreateRole($name: String!, $description: String) {
    createRole(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
      name
    }
  }
`;

export const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      name
      category
      cuisine
      complexity
      servings
      prepTime
      cookTime
      ingredients {
        name
        quantity
      }
      imageUrl
    }
  }
`;

export const GET_RECIPE = gql`
  query GetRecipe($id: ID!) {
    recipe(id: $id) {
      id
      name
      category
      cuisine
      ingredients {
        name
        quantity
      }
      instructions
      servings
      prepTime
      cookTime
      complexity
      imageUrl
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe(
    $name: String!
    $category: String!
    $cuisine: String!
    $ingredients: [IngredientInput!]!
    $instructions: String!
    $servings: String
    $prepTime: String
    $cookTime: String
    $complexity: Int
    $imageUrl: String
  ) {
    createRecipe(
      name: $name
      category: $category
      cuisine: $cuisine
      ingredients: $ingredients
      instructions: $instructions
      servings: $servings
      prepTime: $prepTime
      cookTime: $cookTime
      complexity: $complexity
      imageUrl: $imageUrl
    ) {
      id
      name
      category
      cuisine
      ingredients {
        name
        quantity
      }
      instructions
      servings
      prepTime
      cookTime
      complexity
      imageUrl
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe(
    $id: ID!
    $name: String
    $category: String
    $cuisine: String
    $ingredients: [IngredientInput!]
    $instructions: String
    $servings: String
    $prepTime: String
    $cookTime: String
    $complexity: Int
    $imageUrl: String
  ) {
    updateRecipe(
      id: $id
      name: $name
      category: $category
      cuisine: $cuisine
      ingredients: $ingredients
      instructions: $instructions
      servings: $servings
      prepTime: $prepTime
      cookTime: $cookTime
      complexity: $complexity
      imageUrl: $imageUrl
    ) {
      id
      name
      category
      cuisine
      ingredients {
        name
        quantity
      }
      instructions
      servings
      prepTime
      cookTime
      complexity
      imageUrl
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`;

export const GET_PROFILES = gql`
  query GetProfiles {
    profiles {
      id
      firstName
      lastName
      dateOfBirth
      email
      createdAt
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CreateProfile($firstName: String!, $lastName: String, $dateOfBirth: String, $email: String) {
    createProfile(firstName: $firstName, lastName: $lastName, dateOfBirth: $dateOfBirth, email: $email) {
      id
      firstName
      lastName
      dateOfBirth
      email
      createdAt
    }
  }
`;

export const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

export const GET_SPELLINGS = gql`
  query GetSpellings($profileId: ID!) {
    spellings(profileId: $profileId) {
      id
      word
      definition
      speltCount
      needsRevision
      createdAt
    }
  }
`;

export const SEARCH_SPELLINGS = gql`
  query SearchSpellings($profileId: ID!, $query: String!) {
    searchSpellings(profileId: $profileId, query: $query) {
      id
      word
      definition
      speltCount
      needsRevision
      createdAt
    }
  }
`;

export const ADD_SPELLING = gql`
  mutation AddSpelling($profileId: ID!, $word: String!, $definition: String) {
    addSpelling(profileId: $profileId, word: $word, definition: $definition) {
      id
      word
      definition
      speltCount
      needsRevision
      createdAt
    }
  }
`;

export const INCREMENT_SPELT_COUNT = gql`
  mutation IncrementSpeltCount($id: ID!) {
    incrementSpeltCount(id: $id) {
      id
      speltCount
    }
  }
`;

export const DECREMENT_SPELT_COUNT = gql`
  mutation DecrementSpeltCount($id: ID!) {
    decrementSpeltCount(id: $id) {
      id
      speltCount
    }
  }
`;

export const TOGGLE_REVISION = gql`
  mutation ToggleRevision($id: ID!) {
    toggleRevision(id: $id) {
      id
      needsRevision
    }
  }
`;

export const DELETE_SPELLING = gql`
  mutation DeleteSpelling($id: ID!) {
    deleteSpelling(id: $id) {
      id
    }
  }
`;
