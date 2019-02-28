const actions = (maps, getState) => ({
  getUsers: async () => {
    const { data } = await Promise.resolve({ data: 'lol ' })
    maps.users.setUsers(data)
    return data
  },
})

export default actions
