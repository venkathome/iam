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
      ingredients
      instructions
      servings
      prepTime
      cookTime
      complexity
      imageUrl
    }
  }
`;
