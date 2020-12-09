# pl-server

## External APIs keys

- Modify the following lines in [.env](./.env) before starting servers:

```
P_PUBLIC_KEY=<pixabay-api-key>
S_PUBLIC_KEY=<storyblocks-public-key>
S_PRIVATE_KEY=<storyblocks-private-key>
U_PUBLIC_KEY=<unsplash-access-key>
```

## Config

- Refer to [config.ts](./src/config.ts).

## Start server with docker

```
docker-compose build
docker-compose up -d
```

## Start server alone in local

```
yarn install
yarn start:ts
```

## Useful commands

```
yarn dev # start server for development
yarn apiTest # Test results from external apis
```

## Test

- `external api test` within test result may failed if external apis is not work as excepted.

```
yarn test
open data/report/index.html               # test result report
open data/coverage/lcov-report/index.html # test coverage report
```

## Graphql Playground

- Visit http://localhost:4000/graphql after starting the server.

## Programming language

- Typescript is used instead of Javascript as it has type, class and interface which make easier for development / maintainance.

## Cache image search results

- Redis is used to cache results from different apis. Results will be return from redis instead of real apis if certain keywords have been queried before. Cache expiry time can be changed by applying environment variable `CACHE_EXPIRY_TIME` in [.env](./.env).
