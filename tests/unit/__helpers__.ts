
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

export const testPropertiesOnExist = (requiredProperties: Array<[string, string]>, objectContainsProperties: any) => {
  requiredProperties.forEach(([property, type]) => {
    describe(`"${property}" property`, () => {
      test(`module should contain this property`, () => {
        expect(objectContainsProperties).toHaveProperty(property)
      })
      test(`this property should have type "${type}"`, () => {
        expect(typeof objectContainsProperties[property]).toBe(type)
      })
    })
  })
}
