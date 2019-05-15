<div align="center">

  [![stonex](./logo.png)](https://www.npmjs.com/package/stonex) 

  [![](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
  [![](https://img.shields.io/npm/v/stonex.svg)](https://www.npmjs.com/package/stonex)
  [![](https://img.shields.io/travis/acacode/stonex.svg)](https://travis-ci.org/acacode/stonex)
  [![](https://www.codefactor.io/repository/github/acacode/stonex/badge/master)](https://www.codefactor.io/repository/github/acacode/stonex/overview/master)
  [![](https://img.shields.io/npm/dm/stonex.svg)](http://npm-stat.com/charts.html?package=stonex)
  [![](https://badgen.net/bundlephobia/min/stonex)](https://bundlephobia.com/result?p=stonex)
  [![](https://badgen.net/bundlephobia/minzip/stonex)](https://bundlephobia.com/result?p=stonex)

  <p>
    🌀 State container for JavaScript/TypeScript applications 🌀️
  </p>
</div>


## What is that?

This is a simple and easy library for managing/storing data.  
It allows you to store and manage data correctly, and also combine all business logic into separated `Stonex` modules.

Easily configurable, most things can be overridden if necessary.

As well as in other similar libraries, each "Stonex" module has its own **state** and **actions**. But, unlike other libraries, most of the `Stonex` features are provided "out of the box", for example, the creating asynchronous actions.

The syntax of the modules is almost identical to the syntax of the `ReactJS` component.


## 💡 How to use

**1.** Needs to install it:

```shell

  npm i -S stonex

  # or using yarn

  yarn add stonex

```

**2.** Create a `StonexModule` which will contain actions and state

`StonexModule` gives methods `setState`, `getState` (the same as `this.state`), `resetState`

```js
  // UsersModule.js

  import { StonexModule } from 'stonex'

  export default class UsersModule extends StonexModule {

    // required field
    state = {}

    createUser = async (id, userData) => {
      this.setState({
        ...this.state,
        [id]: {...userData}
      })

      return this.state
    }

  }

```

**3.** Create a store using class `StonexStore`:

```js
  // store.js

  import { StonexStore } from 'stonex'
  import UsersModule from './UsersModule'

  const store = new StonexStore({
    users: UsersModule,
  })

```

**4.** Use `store` to work with modules:

```js
  // store.js

  store.modules.users.createUser('123', { firstName: 'Foo' })

  console.log(store.modules.users.state) // { '123': { firstName: 'Foo' } }

  // you can reset state of your user module using
  store.modules.users.resetState()

  // after 'resetState' methodd your state will have initial value
  console.log(store.modules.users.state) // {}

```


## 📚 Documentation


### `StonexStore`  
`import { StonexStore } from 'stonex'`  
[Code link](./src/StonexStore.ts#L33)  

Create a new stonex store  

Have two arguments:  

  1. **modules** - Map of modules which will contains in stonex store  
  Each module should be extended from `StonexModule` class  

  2. **configuration** - Configuration object which need to override something inside stonex.  
  Have keys: `stateWorker`, `modifiers`  

    2.1. `stateWorker`  
    Default value is `StateWorker`  
    [Code link](./src/StateWorker.ts#L4)  

    Needs for overriding of all behaviour with working with state of each module.(`this.setState`, `this.getState`, etc)  

    2.2. `modifiers`  
    Default value is `[]`  

    This list array of functions where function is [Modifier](./src/ModifiersWorker.ts#L9)  

    Simple description about `Modifier` type:  

```js
const yourModifier = (store) => {
  // it has been called when store will be created

  return (module) => {
    // it has been called when module will be created

    return (actionArgs, moduleName, methodName) => {
      // it has been called when some action will be called

    }
  }
}
```



Usings:  

```js
const store = new StonexStore(modules, configuration)
```





## 📝 License

Licensed under the [MIT License](./LICENSE).
