const { ApolloServer, gql } = require('apollo-server');
const dotenv = require('dotenv');
const { MongoClient, ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7 days' });

const getUserFromToken = async (token, db) => {
  if (!token) return null;
  const tokenData = jwt.verify(token, JWT_SECRET);
  if (!tokenData?.id) return null;

  return await db.collection('Users').findOne({ _id: ObjectID(tokenData.id) });
};

const typeDefs = gql`
  #root query
  type Query {
    myProjectList: [Project!]!
  }

  #root mutation
  type Mutation {
    # auth mutations
    signUp(input: SignUpInput!): AuthUser!
    signIn(input: SignInInput!): AuthUser!

    # project mutations
    createProject(input: ProjectInput!): Project!
  }

  #inputs
  input SignUpInput {
    email: String!
    password: String!
    name: String!
    avatar: String
  }
  input SignInInput {
    email: String!
    password: String!
  }
  input ProjectInput {
    title: String!
    status: Status
  }

  #types
  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type Project {
    id: ID!
    createdAt: String!
    title: String!
    progress: Float!
    status: Status

    users: [User!]!
    todos: [Todo!]!
  }

  type Todo {
    id: ID!
    content: String!
    status: Status
    isCompleted: Boolean!

    project: Project!
  }

  enum Status {
    TODO
    IN_PROGRESS
    COMPLETED
    BLOCKED
    REJECTED
  }
`;

const resolvers = {
  Query: {
    myProjectList: async (_, __, { db, user }) => {
      // Protected Route
      if (!user) throw new Error('Authentication Error. Please sign in.');

      // Get Projects where user making query's userId is in the Projects userIds array
      const projectList = await db
        .collection('Projects')
        .find({
          userIds: user._id,
        })
        .toArray();

      // and return array
      return projectList;
    },
  },
  Mutation: {
    // Auth Resolvers
    signUp: async (_, { input }, { db }) => {
      const _password = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: _password,
      };
      // persist to DB
      const result = await db.collection('Users').insertOne(newUser);
      const user = result.ops[0];
      return {
        user,
        token: getToken(user),
      };
    },
    signIn: async (_, { input }, { db }) => {
      const user = await db.collection('Users').findOne({
        email: input.email,
      });
      if (!user || !bcrypt.compareSync(input.password, user.password)) {
        throw new Error('Invalid Credentials');
      }
      return {
        user,
        token: getToken(user),
      };
    },

    // Project Resolvers
    createProject: async (_, { input }, { db, user }) => {
      // Protected Route
      if (!user) throw new Error('Authentication Error. Please sign in.');

      //
      const newProject = {
        createdAt: new Date().toISOString(),
        title: input.title,
        status: input.status,
        userIds: [user._id],
      };
      const result = await db.collection('Projects').insertOne(newProject);
      return result.ops[0];
    },
  },

  User: {
    id: ({ _id, id }) => _id || id,
  },
  Project: {
    id: ({ _id, id }) => _id || id,
    progress: () => 0,
    users: async ({ userIds }, _, { db }) =>
      Promise.all(
        userIds.map((userId) => db.collection('Users').findOne({ _id: userId }))
      ),
  },
};

const start = async () => {
  // Connect to MongoDB
  const client = new MongoClient(
    'mongodb+srv://admin:admin@cluster0.fsjum.mongodb.net/taskade?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  try {
    await client.connect();
  } catch (error) {
    console.error('error connecting', error);
  }
  // get DB (to later attach to context)
  const db = client.db(DB_NAME);

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromToken(req.headers.authorization, db);
      return {
        db,
        user,
      };
    },
  });
  server.listen().then(({ url }) => {
    console.log(`server is listening at ${url}`);
  });
};

start();