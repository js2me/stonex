
export interface TestableData {
  [propertyName: string]: Array<[string, any]>
}

export const testAllCases = (testableData: TestableData, getDescribeName: (propertyName: string) => string) => {

  Object.keys(testableData).forEach(propertyName => {
    describe(getDescribeName(propertyName), () => {
      const tests = testableData[propertyName]
      tests.forEach(([nameOfTest, testFunc]: [string, any]) => {
        test(nameOfTest, testFunc)
      })
    })
  })
}
