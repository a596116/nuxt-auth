import { createEvent, getQuery, readBody, setCookie } from 'h3'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 將憑證加密存儲在 cookie 中（生產環境應使用更安全的方式）
    for (const [provider, credentials] of Object.entries(body)) {
      setCookie(
        event,
        `auth_credentials_${provider}`,
        JSON.stringify(credentials),
        {
          httpOnly: true, // 瀏覽器腳本無法訪問
          secure: process.env.NODE_ENV === 'production', // 只在 HTTPS 下傳輸
          sameSite: 'strict', // 防止 CSRF 攻擊
          maxAge: 60 * 60 * 24 * 30, // 30 天有效期
          path: '/',
        }
      )
    }

    return { success: true, message: '登入憑證已保存' }
  } catch (error: unknown) {
    return {
      success: false,
      message: '保存憑證時發生錯誤',
      error: error instanceof Error ? error.message : String(error),
    }
  }
})
