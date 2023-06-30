# Deno GraphQL API with MongoDB

## Description

This is a template to build a flexible and efficient API for manipulating data
using Deno, GraphQL, and MongoDB. Ready to run on Deno deploy.

## Requirements

- [Deno](https://deno.land/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)

## Set up

### Clone the repo

```bash
git clone https://github.com/Carlos0934/deno-graphql.git
```

### Create a .env file

```bash
touch .env
```

### Add the following variables to the .env file

```bash
MONGO_URI=mongodb://localhost:27017
MONGO_DB=example
```

### Install dev npm packages

```bash
npm install
```

### Cache dependencies

```bash
deno cache --unstable --lock=deno.lock src/main.ts
```

### Run the app

```bash
deno run --allow-net --allow-read --allow-write --allow-plugin --unstable src/main.ts
```

## Usage

### How run the app

```bash
deno task dev
```

### How update graphql schema

first update the schema.graphql file and then run the following command to
generate the types:

```bash
deno  task generate
```

## Modules Used

- [Hono](https://github.com/honojs/hono) as main web framework.
- [Zod](https://github.com/colinhacks/zod) for schema validation for mongo
  models.
- [Yoga-Graphql](https://the-guild.dev/graphql/yoga-server/docs/integrations/integration-with-deno)
  as graphql server.
- [MongoDB](https://deno.land/x/mongo) as database driver.

## How contribute

Contributions are welcome! If you want to contribute to this project, you can do
the following:

Open issues to report bugs or request new features. Submit pull requests to fix
existing issues or add new functionality. Provide constructive feedback and
suggestions on existing issues and pull requests.

## License

[MIT](https://choosealicense.com/licenses/mit/)
