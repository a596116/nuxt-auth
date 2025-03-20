import { getCookie } from 'h3'
import type { H3Event } from 'h3'

export async function getCredentials(event: H3Event, provider: string) {
  // 嘗試從 cookie 中讀取用戶輸入的憑證
  const cookieCredentials = getCookie(event, `auth_credentials_${provider}`)

  if (cookieCredentials) {
    try {
      return JSON.parse(cookieCredentials)
    } catch (e) {
      console.error(`解析 ${provider} 憑證錯誤:`, e)
    }
  }

  // 如果沒有用戶輸入的憑證，回退到 runtimeConfig
  const config = useRuntimeConfig()

  switch (provider) {
    case 'google':
      return {
        clientId: config.google.clientId,
        clientSecret: config.google.clientSecret,
      }
    case 'github':
      return {
        clientId: config.github.clientId,
        clientSecret: config.github.clientSecret,
      }
    case 'apple':
      return {
        clientId: config.apple.clientId,
        clientSecret: config.apple.clientSecret,
        teamId: config.apple.teamId,
        keyId: config.apple.keyId,
      }
    case 'facebook':
      return {
        clientId: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret,
      }
    case 'line':
      return {
        clientId: config.line.clientId,
        clientSecret: config.line.clientSecret,
      }
    default:
      return null
  }
}
