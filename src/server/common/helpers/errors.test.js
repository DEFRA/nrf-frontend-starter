import { vi } from 'vitest'

import { catchAll } from './errors.js'
import { createServer } from '../../server.js'
import { STATUS_CODES } from '../constants/status-codes.js'

describe('#errors', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('Should provide expected Not Found page', async () => {
    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/non-existent-path'
    })

    expect(result).toEqual(
      expect.stringContaining('Page not found | nrf-frontend-starter')
    )
    expect(statusCode).toBe(STATUS_CODES.NOT_FOUND)
  })
})

describe('#catchAll', () => {
  const mockErrorLogger = vi.fn()
  const mockStack = 'Mock error stack'
  const errorPage = 'error/index'
  const mockRequest = (statusCode) => ({
    response: {
      isBoom: true,
      stack: mockStack,
      output: {
        statusCode
      }
    },
    logger: { error: mockErrorLogger }
  })
  const mockToolkitView = vi.fn()
  const mockToolkitCode = vi.fn()
  const mockToolkit = {
    view: mockToolkitView.mockReturnThis(),
    code: mockToolkitCode.mockReturnThis()
  }

  test('Should provide expected "Not Found" page', () => {
    catchAll(mockRequest(STATUS_CODES.NOT_FOUND), mockToolkit)

    expect(mockErrorLogger).not.toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith(errorPage, {
      pageTitle: 'Page not found',
      heading: STATUS_CODES.NOT_FOUND,
      message: 'Page not found'
    })
    expect(mockToolkitCode).toHaveBeenCalledWith(STATUS_CODES.NOT_FOUND)
  })

  test('Should provide expected "Forbidden" page', () => {
    catchAll(mockRequest(STATUS_CODES.FORBIDDEN), mockToolkit)

    expect(mockErrorLogger).not.toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith(errorPage, {
      pageTitle: 'Forbidden',
      heading: STATUS_CODES.FORBIDDEN,
      message: 'Forbidden'
    })
    expect(mockToolkitCode).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN)
  })

  test('Should provide expected "Unauthorized" page', () => {
    catchAll(mockRequest(STATUS_CODES.UNAUTHORIZED), mockToolkit)

    expect(mockErrorLogger).not.toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith(errorPage, {
      pageTitle: 'Unauthorized',
      heading: STATUS_CODES.UNAUTHORIZED,
      message: 'Unauthorized'
    })
    expect(mockToolkitCode).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED)
  })

  test('Should provide expected "Bad Request" page', () => {
    catchAll(mockRequest(STATUS_CODES.BAD_REQUEST), mockToolkit)

    expect(mockErrorLogger).not.toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith(errorPage, {
      pageTitle: 'Bad Request',
      heading: STATUS_CODES.BAD_REQUEST,
      message: 'Bad Request'
    })
    expect(mockToolkitCode).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST)
  })

  test('Should provide expected default page', () => {
    catchAll(mockRequest(STATUS_CODES.IM_A_TEAPOT), mockToolkit)

    expect(mockErrorLogger).not.toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith(errorPage, {
      pageTitle: 'Something went wrong',
      heading: STATUS_CODES.IM_A_TEAPOT,
      message: 'Something went wrong'
    })
    expect(mockToolkitCode).toHaveBeenCalledWith(STATUS_CODES.IM_A_TEAPOT)
  })

  test('Should provide expected "Something went wrong" page and log error for internalServerError', () => {
    catchAll(mockRequest(STATUS_CODES.INTERNAL_SERVER_ERROR), mockToolkit)

    expect(mockErrorLogger).toHaveBeenCalledWith(mockStack)
    expect(mockToolkitView).toHaveBeenCalledWith(errorPage, {
      pageTitle: 'Something went wrong',
      heading: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong'
    })
    expect(mockToolkitCode).toHaveBeenCalledWith(
      STATUS_CODES.INTERNAL_SERVER_ERROR
    )
  })
})
