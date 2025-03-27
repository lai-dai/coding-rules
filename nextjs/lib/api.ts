import {
  md5,
} from "js-md5"
import {
  type Session,
} from "next-auth"
import {
  getSession, signOut,
} from "next-auth/react"
import {
  toast,
} from "sonner"

import {
  updateSession,
} from "~/lib/api/session"

import {
  env,
} from "~/env"
import {
  type RefreshTokenInput,
} from "~/features/auth/type/auth"
import BaseFetch, {
  type BaseFetchResponse, type RequestConfig,
} from "~/lib/modules/base-fetch"
import {
  type ApiResponse,
} from "~/types/api"

interface QueueItem {
  resolve: (value: BaseFetchResponse<unknown> | PromiseLike<BaseFetchResponse<unknown>>) => void
  reject: (error: unknown) => void
  config: RequestConfig
  url: string
}

export const api = new BaseFetch(env.NEXT_PUBLIC_API_ENDPOINT_URL)

let isRefreshingToken = false
let failedResponseQueue: QueueItem[] = []

const processResponseQueue = (error: unknown = null) => {
  failedResponseQueue.forEach((promise) => {
    // eslint-disable-next-line no-restricted-syntax
    if (error) {
      promise.reject(error)
    }
    else {
      promise.resolve(api.request(
        promise.url, promise.config
      ))
    }
  })

  failedResponseQueue = []
}

let sessionCached: Session | null = null

const getDefaultHeaderAuthorization = () => {
  const date = new Date().toISOString().split("T")[0]
  return `Bearer ${md5("karabox@cms@" + date)}`
}

api.interceptors.request.use(async (config) => {
  (config.headers as Record<string, unknown>).Authorization = getDefaultHeaderAuthorization()

  if (!sessionCached) {
    sessionCached = await getSession()
  }

  if (sessionCached?.user.token) {
    (config.headers as Record<string, unknown>).Authorization = `Bearer ${sessionCached.user.token}`
  }

  return config
})

api.interceptors.response.use(async (response) => {
  const originalRequest = response.config

  if (!sessionCached) {
    return response
  }

  if (isRefreshingToken) {
    // eslint-disable-next-line custom-rules/encourage-object-params
    return new Promise((
      resolve, reject
    ) => {
      failedResponseQueue.push({
        resolve,
        reject,
        url: response.config.url ?? "",
        config: response.config,
      })
    })
  }

  // Status code 402: Token expired
  if (response.statusCode === 402) {
    // hiện tại chưa refetch token được
    toast.info("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại")
    await signOut()

    originalRequest._retry = true
    isRefreshingToken = true

    try {
      // Thực hiện refresh token
      const responseRefreshToken = await refreshToken({
        old_token: sessionCached.user.token,
        refresh_token: sessionCached.user.refresh_token,
      })
      isRefreshingToken = false

      // Update session
      await updateSession({
        token: responseRefreshToken.data?.token,
        refresh_token: responseRefreshToken.data?.refresh_token,
      })

      // Force session cache
      sessionCached = null

      // Xử lý các request trong queue
      processResponseQueue()

      // Thực hiện lại request ban đầu
      return api.request(
        originalRequest.url ?? "", originalRequest
      )
    }
    catch (refreshError) {
      isRefreshingToken = false
      processResponseQueue(refreshError)
      sessionCached = null
      await signOut()
      throw refreshError
    }
  }

  // Cần nhập mã code xác nhận đăng nhập (khi bật xác thực 2 lớp)
  if (response.status === 410) {
    await signOut()
  }

  return response
})

async function refreshToken(data: RefreshTokenInput): Promise<ApiResponse<{
  _id: number
  old_token: string
  token: string
  refresh_token: string
}>> {
  const response = await fetch(
    env.NEXT_PUBLIC_API_ENDPOINT_URL + "/user/refreshToken", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": getDefaultHeaderAuthorization(),
      },
      body: JSON.stringify(data),
    }
  )

  return response.json()
}
