import {
    MiddlewareAction, MiddlewareData,
    MiddlewareResponse, MiddlewareResponses
  } from '.'
import { copy } from './helpers/base'

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
  ) {
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
