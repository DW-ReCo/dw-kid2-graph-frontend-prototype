# KID2 Application Prototype

A notebook to chain and persist common verification tasks.

## Installation

Currently there is no non-development build of the application.

## Development

### Data formats

Please see [data formats](./docs/data_formats.md)

### Install the dependencies

This application requires `node` and `npm` to be installed. To install it, please run:

```bash
npm i
```

### Run the application

Without the optional development replication server:

```bash
npm run dev:next
```

With a replication server:

```bash
npm run dev:next
```

### Testing

We use [cypress](https://docs.cypress.io/guides/overview/why-cypress) as a test runner, which executes tests in multiple environments, such as browsers and electron.

#### Running the tests programatically

To run the tests in the command line, you can write:

```bash
npm run cypress:run
```

This will use headless browsers to run the tests and return the results

#### Running the tests interactively

To play with and run the tests during development, you can use the command:

```bash
npm run cypress:open
```
