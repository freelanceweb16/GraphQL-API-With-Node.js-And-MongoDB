const Express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP
const Mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const {
    GraphQLID,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');

const app = Express();

const userName = process.env.USERNAMEMONGODB;
const password = process.env.PASSWORDMONGODB;
const cluster = process.env.CLUSTERMONGODB;
const uri = "mongodb+srv://"+userName+":"+password+"@"+cluster+"/?retryWrites=true&w=majority";

// Mongoose
try {
    Mongoose.connect(uri, { useNewUrlParser: true});
    console.log('Connected to MongoDB');
} catch (error) {
    console.error(error);
}

// Schema MongoDB
const User = Mongoose.model('user', {
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    phone: String,
    website: String,
    company: String,
    username: String,
    password: String,
    role: String,
    status: String,
    created: Date,
});

// GraphQL
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
        phone: { type: GraphQLString },
        website: { type: GraphQLString },
        company: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        role: { type: GraphQLString },
        status: { type: GraphQLBoolean },
        created: { type: GraphQLString },
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            users: {
                type: new GraphQLList(UserType),
                resolve: (root, args, context, info) => User.find()
            },
            user: {
                type: UserType,
                args: {
                    id: { type: GraphQLID }
                },
                resolve: (root, args) => User.findById(args.id)
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            addUser: {
                type: UserType,
                args: {
                    firstName: { type: new GraphQLNonNull(GraphQLString) },
                    lastName: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    age: { type: new GraphQLNonNull(GraphQLInt) },
                    phone: { type: new GraphQLNonNull(GraphQLString) },
                    website: { type: new GraphQLNonNull(GraphQLString) },
                    company: { type: new GraphQLNonNull(GraphQLString) },
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    role: { type: new GraphQLNonNull(GraphQLString) },
                    status: { type: new GraphQLNonNull(GraphQLBoolean) },
                    created: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: (root, args) => {
                    const user = new User(args);
                    return user.save();
                }
            },
            editUser: {
                type: UserType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) },
                    firstName: { type: new GraphQLNonNull(GraphQLString) },
                    lastName: { type: new GraphQLNonNull(GraphQLString) },
                    email: { type: new GraphQLNonNull(GraphQLString) },
                    age: { type: new GraphQLNonNull(GraphQLInt) },
                    phone: { type: new GraphQLNonNull(GraphQLString) },
                    website: { type: new GraphQLNonNull(GraphQLString) },
                    company: { type: new GraphQLNonNull(GraphQLString) },
                    username: { type: new GraphQLNonNull(GraphQLString) },
                    password: { type: new GraphQLNonNull(GraphQLString) },
                    role: { type: new GraphQLNonNull(GraphQLString) },
                    status: { type: new GraphQLNonNull(GraphQLBoolean) },
                    created: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve: (root, args) => {
                    return User.findByIdAndUpdate(args.id, args, { new: true });
                }
            },
            deleteUser: {
                type: UserType,
                args: {
                    id: { type: new GraphQLNonNull(GraphQLID) }
                },
                resolve: (root, args) => {
                    return User.findByIdAndRemove(args.id);
                }
            }
        }
    })
});


// App NodeJs
app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));


app.listen(3000, () => {
    console.log('Server is running on port 3000');

});