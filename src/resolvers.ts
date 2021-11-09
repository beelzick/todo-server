import { Resolvers, Todo } from './lib/graphql'
import { ObjectId } from 'mongodb'

const resolvers: Resolvers = {
    Query: {
        user: async (parent, args, context) => {
            const user = await context.db.collection('users').findOne({ _id: args._id })
            return {
                ...user
            }
        }
    },
    Mutation: {
        setTodoDone: async (parent, args, context) => {
            const userData = await context.db.collection('users').findOneAndUpdate(
                { _id: args.userId },
                {
                    $set: {
                        'todos.$[updateTodo].done': args.done,
                    }
                },
                {
                    returnDocument: 'after',
                    arrayFilters: [{ 'updateTodo._id': new ObjectId(args.todoId) }],
                    projection: { _id: 0, todos: 1 }
                },
            )
            const todo = userData.value.todos.filter((todo: Todo) => todo!._id!.toString() === args.todoId)
            return {
                ...todo[0]
            }
        },
        createTodo: async (parent, { content, userId }, context) => {
            const userData = await context.db.collection('users').findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        todos: {
                            content,
                            done: false,
                            _id: new ObjectId()
                        }
                    }
                },
                { returnDocument: 'after' }
            )

            return userData.value
        },
        deleteTodo: async (parent, args, context) => {
            const userData = await context.db.collection('users').findOneAndUpdate(
                { _id: args.userId },
                { $pull: { todos: { _id: new ObjectId(args.todoId) } } },
                { returnDocument: 'after' }
            )
            return userData.value
        }
    }
}

export default resolvers