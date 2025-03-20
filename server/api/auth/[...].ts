import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import AppleProvider from 'next-auth/providers/apple'
import FacebookProvider from 'next-auth/providers/facebook'
import LineProvider from 'next-auth/providers/line'
import { NuxtAuthHandler } from '#auth'
import { getCredentials } from '../../utils/credentials'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // 獲取用戶輸入的各提供商憑證
  const googleCreds = await getCredentials(event, 'google')
  const githubCreds = await getCredentials(event, 'github')
  const appleCreds = await getCredentials(event, 'apple')
  const facebookCreds = await getCredentials(event, 'facebook')
  const lineCreds = await getCredentials(event, 'line')

  return NuxtAuthHandler({
    // 密鑰用於加密 Cookie
    secret: useRuntimeConfig().auth.authSecret,
    // 配置一個或多個身份驗證提供商
    providers: [
      // @ts-expect-error 您需要使用 .default 來正確引入
      GoogleProvider.default({
        clientId: googleCreds.clientId,
        clientSecret: googleCreds.clientSecret,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: 'openid email profile', // 確保包含 openid 範圍
          },
        },
      }),
      // @ts-expect-error 您需要使用 .default 來正確引入
      GithubProvider.default({
        clientId: githubCreds.clientId,
        clientSecret: githubCreds.clientSecret,
        // 可以選擇請求額外的權限範圍
        scope: 'read:user user:email',
      }),
      // @ts-expect-error 您需要使用 .default 來正確引入
      AppleProvider.default({
        clientId: appleCreds.clientId,
        clientSecret: appleCreds.clientSecret,
        // Apple 需要這些額外設定
        wellKnown: 'https://appleid.apple.com/.well-known/openid-configuration',
        // 提供應用程式的團隊 ID 和金鑰 ID
        team_id: appleCreds.teamId,
        key_id: appleCreds.keyId,
      }),
      // @ts-expect-error 您需要使用 .default 來正確引入
      FacebookProvider.default({
        clientId: facebookCreds.clientId,
        clientSecret: facebookCreds.clientSecret,
        // 請求用戶的基本信息和郵箱
        scope: 'email,public_profile',
      }),
      // @ts-expect-error 您需要使用 .default 來正確引入
      LineProvider.default({
        clientId: lineCreds.clientId,
        clientSecret: lineCreds.clientSecret,
        // Line 需要這些額外權限
        scope: 'profile openid email',
      }),
    ],
    callbacks: {
      async jwt({
        token,
        account,
        profile,
      }: {
        token: any
        account: any
        profile: any
      }) {
        // 初次登入時，將資料從 account 和 profile 合併到 token
        if (account && profile) {
          token.sub = profile.sub || account.providerAccountId
          token.providerAccountId = account.providerAccountId
          token.provider = account.provider
        }
        return token
      },
      async session({ session, token }: { session: any; token: any }) {
        // 將 token 中的資料添加到 session
        if (session.user) {
          session.user.id = token.sub
          session.user.providerAccountId = token.providerAccountId
          session.user.provider = token.provider
        }
        return session
      },
    },
  })(event)
})
