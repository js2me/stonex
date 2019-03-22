import { copy } from './helpers/base'

export enum MiddlewareDataTypes {
  METHOD_CALL = 'METHOD_CALL', STATE_CHANGE = 'STATE_CHANGE', STATE_GET = 'STATE_GET'
}

export enum MiddlewareResponses {
  BREAK = 'BREAK', PREVENT = 'PREVENT', MODIFY = 'MODIFY'
}

export declare type MiddlewareResponse = [MiddlewareResponses, any?]

export declare interface MiddlewareData {
  moduleName: string,
  type: MiddlewareDataTypes,
  methodName?: string,
  data?: any,
  state: object,
}

export declare type MiddlewareAction =
  (
    data: MiddlewareData,
    prevResponse?: null | MiddlewareResponse
  ) => (void | MiddlewareResponse)

export default class Middleware {

  public static call (
      middlewares: MiddlewareAction[],
      mdAction: () => MiddlewareData
    ): MiddlewareResponse {
    const data = (middlewares.length ? mdAction() : null) as MiddlewareData
    const breakResponse: MiddlewareResponse = [MiddlewareResponses.BREAK, null]
    let prevResponse: MiddlewareResponse = breakResponse

    for (const middleware of middlewares) {
      const [ response, changes ] = middleware(data, prevResponse) || breakResponse
      if (response && response !== MiddlewareResponses.BREAK) {
        if (response === MiddlewareResponses.PREVENT) {
          return [response, changes]
        } else {
          prevResponse = [response, copy(changes)]
        }
      }
    }

    return prevResponse
  }

  public static connect (
    middlewares: MiddlewareAction[],
    mdAction: () => MiddlewareData,
    action: (changes: any) => any,
    changableData: any
  ): any {
    const [response, modifiedState] = Middleware.call(middlewares, mdAction)
    if (response === MiddlewareResponses.PREVENT) {
      return
    }
    if (response === MiddlewareResponses.MODIFY) {
      changableData = modifiedState
    }
    return action(changableData)
  }
}
