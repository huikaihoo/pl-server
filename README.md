# pl-server

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
```

## Unit test

```
yarn test
open data/report/index.html               # test result report
open data/coverage/lcov-report/index.html # test coverage report
```

## Programming language

- Typescript is used instead of Javascript as it has type, class and interface which make easier for development / maintainance
