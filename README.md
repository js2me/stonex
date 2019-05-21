<div align="center">

  [![stonex](./logo.png)](https://www.npmjs.com/package/stonex) 

  [![](https://img.shields.io/badge/license-MIT-red.svg)](./LICENSE)
  [![](https://img.shields.io/npm/v/stonex.svg)](https://www.npmjs.com/package/stonex)
  [![](https://img.shields.io/travis/acacode/stonex.svg)](https://travis-ci.org/acacode/stonex)
  [![](https://img.shields.io/npm/dm/stonex.svg)](http://npm-stat.com/charts.html?package=stonex)
  [![](https://badgen.net/bundlephobia/min/stonex)](https://bundlephobia.com/result?p=stonex)
  [![](https://badgen.net/bundlephobia/minzip/stonex)](https://bundlephobia.com/result?p=stonex)

  <p>
    🌀 State container for JavaScript/TypeScript applications 🌀️
  </p>
</div>

#### Table of Contents  

[What is that ?](#what-is-that)  
[How to use](#-how-to-use)  
[Documentation](#-documentation):  
    - [Stonex Store](#stonexstoresource-link)  
    - [Stonex Module](#stonexmodulesource-link)  
    - [StateWorker](#stateworkersource-link)  
    - [createStoreBinder](#createstorebindersource-link)  
[License](#-license)  


## ❓ What is that ?

This is a simple and easy library for managing/storing data.  
It allows you to store and manage data correctly, and also combine all business logic into separated `Stonex` modules.

Easily configurable, most things can be overridden if necessary.

As well as in other similar libraries, each `Stonex` module has its own **state** and **actions**. But, unlike other libraries, most of the `Stonex` features are provided "out of the box", for example, the creating asynchronous actions.

The syntax of the modules is almost identical to the syntax of the `ReactJS` component.

Also currently `Stonex` is supporting integrations with: [ReactJS (react-stonex)](https://github.com/acacode/react-stonex)

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


### `StonexStore`[[Source link]](./src/StonexStore.ts#L33)  
`import { StonexStore } from 'stonex'`  

Create a new stonex store  

Have two arguments:  

 1. **modules** - Map of modules which will contains in stonex store.  
  Each module should be extended from `StonexModule` class or you can create a [[pure stonex module]](./README#L229)  
 2. **configuration** - Configuration object which need to override something inside stonex.  
  Object with keys: `stateWorker`, `modifiers`  
    - `stateWorker`[[Source link]](./src/StateWorker.ts#L4)
        Default value is [`StateWorker`](./src/StateWorker.ts#L4)  
        Needs for overriding of all behaviour with working with state of each module.(`this.setState`, `this.getState`, etc)  
    - `modifiers`[[Source link]](./src/StateWorker.ts#L4)
        Default value is `[]`  
        This list of functions where function is [Modifier](./src/ModifiersWorker.ts#L9)  
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

Instance of `StonexStore` have properties:  

- `connectModule(moduleName: string, module: StonexModule | ModuleConfiguration | PureStonexModule)`  
  Connect Stonex Module to store  
- `createStateSnapshot()`  
  Return snapshot of states of all modules connected to store 
- `getState(moduleName: string)`  
  Returns state of module  
- `modules: StonexModules`  
  Object with stonex modules where key is name of module 
- `resetState(moduleName: string, callback: (state: any) => any = noop)`  
  Reset state of module to initial value  
- `setState(moduleName: string, changes: any, callback: (state: any) => any = noop)`  
  Update state of module  
- `storeId: number`  
  Unique identifier of store  

Usings:  

```js
const store = new StonexStore({
  key1: StonexModule1,
  key2: StonexModule2
}, {
  stateWorker: YourStateWorker,
  modifiers: [
    YourModifier,
    SomeLogger,
    SomeStoreModifier,
  ]
})
```


  <hr>



### `StonexModule`[[Source link]](./src/StonexModule.ts#L3)  
`import { StonexModule } from 'stonex'`  

The important parent class of your stonex modules.  
Provide linking store information to your stonex module and provides specific methods which allows to work with `state`.  


`StonexModule` provides properties: `this.setState`, `this.getState`, `this.resetState`, `this.moduleName`, `this.modules`

`setState` - Update module's state  
`getState` - Same as `this.state`. Returns fresh state of module  
`resetState` - Reset state of module to the initial value  
`moduleName` - Name of that stonex module containing in your store  
`modules` - Reference to store modules. It allows to use other store modules inside module  


Usings:  

```js
import { StonexModule } from 'stonex'

export default class AnimalsModule extends StonexModule{

  /* state */
  state = {}


  /* methods */

  createAnimal = (type, name) => {
    this.setState({
      ...this.state,
      [type]: [
        ...(this.state[type] || []),
        { name }
      ]
    })
    return this.state
  }

  createDog = (name) => this.createAnimal('dogs', name)

  createCat = (name) => this.createAnimal('cats', name)

}

```

Besides using `StonexModule` class you can create a simple object, factically it will works as class extended from StonexModule.  
This simple object `AnimalsModule` (from above code)  

Note: all methods should be not arrow functions.  
```js
export default {
  /* state */
  state: {},
  /* methods */
  createAnimal(type, name) {
    this.setState({
      ...this.state,
      [type]: [
        ...(this.state[type] || []),
        { name }
      ]
    })
    return this.state
  },
  createDog(name){ return this.createAnimal('dogs', name) },
  createCat(name){ return this.createAnimal('cats', name) },
}

```



  <hr>



### `StateWorker`[[Source link]](./src/StateWorker.ts#L4)  
`import { StateWorker } from 'stonex'`  

This is a class which do all things linked with state of each module. It provides initializing, updating and reseting state.  
If will need to change behaviour of things like `resetState` or `setState` then it can helps you.  

Overridden `State Worker` needs to send where you creating a store:  
```js
import { StonexStore, StateWorker } from 'stonex'


class YourStateWorker extends StateWorker {

  resetState(moduleInstance, callback){
    console.log(`Resetting state of ${moduleInstance.moduleName} module`)
    return super.resetState(moduleInstance, callback)
  }
}


const store = new StonexStore({
  key1: StonexModule1,
  key2: StonexModule2
}, {
  stateWorker: YourStateWorker, // HERE
  modifiers: []
})

```



  <hr>



### `createStoreBinder`[[Source link]](./src/StoreBinder.ts#L12)  
`import { createStoreBinder } from 'stonex'`  

This function create an `StoreBinder` which needed if you want to change/override behaviour of all things which sends from store and add common methods/properties.  
Factically its more needed for creating some middleware.  

Example of usage:

```js

import { createStoreBinder, StateWorker, StonexStore } from 'stonex'
import modules, { Modules } from './modules'
import Items from './modules/Items'

const store = new StonexStore(modules)


const modifiedStoreBinder = {
  ...createStoreBinder('items', store),
  cacheState: () => {
    sessionStorage.setItem('items-cache', JSON.stringify(store.modules.items.state))
  }
}

store.connectModule('items', {
  module: Items,
  storeBinder: modifiedStoreBinder
},)

store.modules.items.cacheState()


```

<!-- And maybe currently you have a question why you need to use that ?  

Sometimes in big applications in places where code work with application data gonna need to process data of application -->


## 📝 License

Licensed under the [MIT License](./LICENSE).
