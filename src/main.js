import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
// import { typeDefs, resolvers } from "./schema";

const User = mongoose.model("User", { name: String });

const typeDefs = gql`
	type User {
		id: ID
		name: String
	}

	type Query {
		hello: String!
		users: [User!]
		user(name: String!): User
	}

	type Mutation {
		createUser(name: String!): User!
	}
`;

const resolvers = {
	Query: {
		hello: () => "hi",
		users: async () => User.find(),
		// async user(parent, args, contextValue, info) {
		// 	const user = await User.find({ name: args.name }).exec();
		// 	console.log("User Found: ", { user, args });
		// 	return user;
		// },
		user: async (parent, args, contextValue, info) => {
			const user = await User.findOne({ name: args.name }).exec();
			console.log({ user });
			return user;
		},
	},
	Mutation: {
		createUser: (_, { name }) => {
			const user = new User({ name });
			user.save().then(() => console.log("New user saved: ", user));
			return user;
		},
	},
};

const startServer = async () => {
	const app = express();
	const server = new ApolloServer({
		// these will be defined for both new and existing servers
		typeDefs,
		resolvers,
	});

	await mongoose.connect("mongodb://localhost:27017/hangggtest", {
		useNewUrlParser: true,
	});

	server.start().then((res) => {
		server.applyMiddleware({ app });
		app.listen({ port: 4000 }, () =>
			console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
		);
	});
};

startServer();
