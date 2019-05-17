export default {
  state: {},
  createAnimal (type, name) {
    this.setState({
      ...this.state,
      [type]: [
        ...(this.state[type] || []),
          { name }
      ]
    })
    return this.state
  },
  createDog (name) { return this.createAnimal('dogs', name) },
  createCat (name) { return this.createAnimal('cats', name) },
}
