import { gql } from 'apollo-server'

export const typeDefs = gql`
type Todo {
    _id: ID
    done: Boolean
    content: String
}

type User {
    _id: ID
    todos: [Todo]
}

type Query {
       user(_id: ID!): User
}

type Mutation {
    setTodoDone(userId: ID!, todoId: ID!, done: Boolean): Todo
    createTodo(userId: ID!, content: String!): User
    deleteTodo(userId: ID!, todoId: ID!): User
}
`