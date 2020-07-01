# @poppinss/cliui

> Command line UI Kit used by AdonisJS

This repo is a command line UI Kit used by the AdonisJS framework to design its command line interfaces.

The kit is highly opinionated and we will not allow configurable settings in the near future. We want to be consistent with our UI's without worrying about the configuration. **It's like getting in the [prettier mindset](https://prettier.io/docs/en/option-philosophy.html).**

[![circleci-image]][circleci-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Why AdonisJS needs a CLI UI Kit?](#why-adonisjs-needs-a-cli-ui-kit)
- [Installation](#installation)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why AdonisJS needs a CLI UI Kit?

Read this official blog post to learn more about it.

## Installation

Install the package from the npm registry by running following command.

```sh
npm i @poppinss/cliui

# Yarn users
yarn add @poppinss/cliui
```

## Usage

Import the components you want to use from the package.

```ts
import {
 logger,
 instructions,
 sticker,
 tasks,
} from '@poppinss/cliui'
```

[circleci-image]: https://img.shields.io/circleci/project/github/poppinss/cliui/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/poppinss/cliui 'circleci'
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]: "typescript"
[npm-image]: https://img.shields.io/npm/v/@poppinss/cliui.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/@poppinss/cliui 'npm'
[license-image]: https://img.shields.io/npm/l/@poppinss/cliui?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md 'license'
