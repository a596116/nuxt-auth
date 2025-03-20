<template>
  <div class="page-wrapper">
    <div class="auth-container">
      <div class="title-with-link">
        <h1 class="page-title">第三方登入示範</h1>
        <a
          href="https://github.com/a596116/nuxt-auth"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          title="查看原始碼"
        >
          <svg class="github-link-icon" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </a>
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>載入中</p>
      </div>
      <div v-else-if="!isAuthenticated" class="login-buttons">
        <div class="button-with-help">
          <GoogleLoginButton />
          <button class="help-button" @click="showHelpModal('google')">
            ?
          </button>
        </div>
        <div class="button-with-help">
          <FacebookLoginButton />
          <button class="help-button" @click="showHelpModal('facebook')">
            ?
          </button>
        </div>
        <div class="button-with-help">
          <LineLoginButton />
          <button class="help-button" @click="showHelpModal('line')">?</button>
        </div>
        <div class="button-with-help">
          <GitHubLoginButton />
          <button class="help-button" @click="showHelpModal('github')">
            ?
          </button>
        </div>
        <div class="button-with-help">
          <AppleLoginButton />
          <button class="help-button" @click="showHelpModal('apple')">?</button>
        </div>
      </div>
      <div v-else class="profile-container">
        <div class="user-info">
          <img
            v-if="data?.user?.image"
            :src="data.user.image"
            alt="使用者頭像"
            class="user-avatar"
          />
          <div v-else class="user-avatar-placeholder"></div>
          <div class="user-details">
            <p class="user-name">
              已登入為: {{ data?.user?.name || '未知用戶' }}
            </p>
            <p class="user-provider" v-if="data?.user?.provider">
              來源: {{ getProviderName(data?.user?.provider) }}
            </p>
            <p class="user-id">用戶 ID: {{ getUserId }}</p>
            <p v-if="userEmail" class="user-email">{{ userEmail }}</p>
          </div>
        </div>
        <div class="buttons-container">
          <button class="auth-button debug-button" @click="showSessionData">
            <i class="debug-icon"></i>
            顯示會話數據
          </button>
          <button class="auth-button logout-button" @click="signOut()">
            <svg
              class="logout-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
              />
            </svg>
            登出
          </button>
        </div>
      </div>

      <!-- 添加説明模態視窗 -->
      <div v-if="showHelp" class="help-modal-overlay" @click="closeHelpModal">
        <div class="help-modal" @click.stop>
          <div class="help-modal-header">
            <h3>{{ helpTitle }}</h3>
            <button class="close-button" @click="closeHelpModal">×</button>
          </div>
          <div class="help-modal-content">
            <div v-html="helpContent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '#imports'
import { computed, onMounted, ref } from 'vue'
import GoogleLoginButton from '../components/GoogleLoginButton.vue'
import GitHubLoginButton from '../components/GitHubLoginButton.vue'
import AppleLoginButton from '../components/AppleLoginButton.vue'
import FacebookLoginButton from '../components/FacebookLoginButton.vue'
import LineLoginButton from '../components/LineLoginButton.vue'

useSeoMeta({
  title: '第三方登入示範',
  description: '第三方登入示範',
  ogTitle: '第三方登入示範',
  ogDescription: '第三方登入示範',
  ogImage: '/author.png',
  ogUrl: 'https://nuxt-auth.vercel.app/',
  ogType: 'website',
})

const { status, data, signOut, getSession } = useAuth()
const userId = ref(null)
const sessionInfo = ref(null)
const userEmail = computed(() => data.value?.user?.email || null)

// 計算屬性來正確判斷登入狀態
const isAuthenticated = computed(() => {
  return (
    status.value === 'authenticated' ||
    !!data.value?.user ||
    status.value?.loggedIn
  )
})

// 加載狀態判斷
const isLoading = computed(() => {
  return status.value === 'loading'
})

// 獲取 用戶 ID
const getUserId = computed(() => {
  // 首先檢查 token 中的 sub ID（這是最標準的 OpenID Connect ID）
  if (sessionInfo.value?.token?.sub) {
    return sessionInfo.value.token.sub
  }

  // 其次嘗試用戶對象中的 id（可能是 sub ID 的映射）
  if (sessionInfo.value?.user?.id) {
    return sessionInfo.value.user.id
  }

  // 再次嘗試獲取 OAuth 帳戶的 providerAccountId
  if (sessionInfo.value?.account?.providerAccountId) {
    return sessionInfo.value.account.providerAccountId
  }

  // 然後嘗試從原始會話數據中獲取
  if (data.value?.user) {
    // NextAuth.js 通常將 ID 放在這裡
    if (data.value.user.id) return data.value.user.id
    // 可能直接暴露 sub
    if (data.value.user.sub) return data.value.user.sub
    // 或是作為 providerAccountId
    if (data.value.user.providerAccountId)
      return data.value.user.providerAccountId
  }

  return userId.value || '未找到 ID'
})

// 顯示提供者名稱
function getProviderName(provider) {
  const providers = {
    google: 'Google',
    github: 'GitHub',
    apple: 'Apple',
    facebook: 'Facebook',
    line: 'Line',
  }
  return providers[provider] || provider
}

// 在元件載入時嘗試獲取詳細會話資訊
onMounted(async () => {
  await fetchSessionData()
})

// 獲取會話數據的函數
async function fetchSessionData() {
  if (isAuthenticated.value) {
    try {
      const session = await getSession()
      sessionInfo.value = session
      console.log('完整會話數據:', session)

      // 打印關鍵位置，幫助調試
      console.log('可能的 ID 位置:', {
        'token.sub': session?.token?.sub,
        'user.id': session?.user?.id,
        'account.providerAccountId': session?.account?.providerAccountId,
        'raw data': data.value,
      })

      // 設置 ID 優先順序
      if (session?.token?.sub) {
        userId.value = session.token.sub
      } else if (session?.user?.id) {
        userId.value = session.user.id
      } else if (session?.account?.providerAccountId) {
        userId.value = session.account.providerAccountId
      } else if (session?.user?.email) {
        userId.value = `email:${session.user.email}`
      }
    } catch (error) {
      console.error('獲取會話資訊時出錯:', error)
    }
  }
}

// 顯示詳細會話數據的函數
function showSessionData() {
  console.log('當前會話數據:', {
    sessionInfo: sessionInfo.value,
    userData: data.value,
    status: status.value,
  })

  // 使用開發工具直接尋找 sub ID
  const rawSession = JSON.parse(JSON.stringify(data.value || {}))
  console.log('Raw session data:', rawSession)

  // 遞歸搜索 'sub' 屬性
  function findSub(obj, path = '') {
    if (!obj || typeof obj !== 'object') return

    for (const key in obj) {
      if (key === 'sub') {
        console.log(`找到 sub: ${obj[key]} 在路徑: ${path}.${key}`)
      }
      if (typeof obj[key] === 'object') {
        findSub(obj[key], `${path}.${key}`)
      }
    }
  }

  findSub(rawSession, 'session')

  // 如果沒有會話數據，嘗試重新獲取
  if (!sessionInfo.value) {
    fetchSessionData()
  }

  alert('會話數據已輸出到控制台，請打開開發者工具查看')
}

// 添加提示相關的狀態
const showHelp = ref(false)
const helpContent = ref('')
const helpTitle = ref('')

// 顯示説明模態視窗
function showHelpModal(provider) {
  helpTitle.value = getProviderHelpTitle(provider)
  helpContent.value = getProviderHelpContent(provider)
  showHelp.value = true
}

// 關閉説明模態視窗
function closeHelpModal() {
  showHelp.value = false
}

// 獲取提供者説明標題
function getProviderHelpTitle(provider) {
  const titles = {
    google: 'Google 登入設定與操作說明',
    github: 'GitHub 登入設定與操作說明',
    apple: 'Apple 登入設定與操作說明',
    facebook: 'Facebook 登入設定與操作說明',
    line: 'Line 登入設定與操作說明',
  }
  return titles[provider] || '登入設定與操作說明'
}

// 獲取提供者説明內容
function getProviderHelpContent(provider) {
  const contents = {
    google: `
      <h4>Google 登入設定步驟</h4>
      <ol>
        <li>前往 <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
        <li>創建一個新專案或選擇現有專案</li>
        <li>在左側導航欄選擇「API 和服務」>「憑證」</li>
        <li>點擊「建立憑證」>「OAuth 用戶端 ID」</li>
        <li>設置授權重定向 URI: <code>http://localhost:3000/api/auth/callback/google</code></li>
        <li>取得 Client ID 和 Client Secret</li>
        <li>在環境變數中設定：<br><code>GOOGLE_CLIENT_ID=您的Client_ID<br>GOOGLE_CLIENT_SECRET=您的Client_Secret</code></li>
      </ol>
    `,
    github: `
      <h4>GitHub 登入設定步驟</h4>
      <ol>
        <li>前往 <a href="https://github.com/settings/developers" target="_blank">GitHub Developer Settings</a></li>
        <li>選擇「OAuth Apps」，點擊「New OAuth App」</li>
        <li>填寫應用名稱和回調 URL：<code>http://localhost:3000/api/auth/callback/github</code></li>
        <li>註冊應用後取得 Client ID</li>
        <li>生成一個新的 Client Secret</li>
        <li>在環境變數中設定：<br><code>GITHUB_CLIENT_ID=您的Client_ID<br>GITHUB_CLIENT_SECRET=您的Client_Secret</code></li>
      </ol>
    `,
    apple: `
      <h4>Apple 登入設定步驟</h4>
      <ol>
        <li>前往 <a href="https://developer.apple.com/account/resources/identifiers/list" target="_blank">Apple Developer Portal</a></li>
        <li>創建一個新的應用程式 ID</li>
        <li>啟用「Sign In with Apple」功能</li>
        <li>配置 Service ID 並註冊網域</li>
        <li>生成私鑰並下載</li>
        <li>在環境變數中設定：<br><code>APPLE_CLIENT_ID=您的Client_ID<br>APPLE_CLIENT_SECRET=您的Client_Secret<br>APPLE_KEY_ID=您的Key_ID<br>APPLE_TEAM_ID=您的Team_ID</code></li>
      </ol>
    `,
    facebook: `
      <h4>Facebook 登入設定步驟</h4>
      <ol>
        <li>前往 <a href="https://developers.facebook.com/" target="_blank">Facebook Developers</a></li>
        <li>創建一個新應用程式</li>
        <li>添加「Facebook 登入」產品</li>
        <li>在設定中添加重定向 URI：<code>http://localhost:3000/api/auth/callback/facebook</code></li>
        <li>取得應用程式 ID 和密鑰</li>
        <li>在環境變數中設定：<br><code>FACEBOOK_CLIENT_ID=您的App_ID<br>FACEBOOK_CLIENT_SECRET=您的App_Secret</code></li>
      </ol>
    `,
    line: `
      <h4>Line 登入設定步驟</h4>
      <ol>
        <li>前往 <a href="https://developers.line.biz/console/" target="_blank">Line Developers Console</a></li>
        <li>創建一個提供者和新頻道</li>
        <li>選擇「LINE Login」作為頻道類型</li>
        <li>添加回調 URL：<code>http://localhost:3000/api/auth/callback/line</code></li>
        <li>設置所需權限：profile, openid, email</li>
        <li>取得 Channel ID 和 Channel Secret</li>
        <li>在環境變數中設定：<br><code>LINE_CLIENT_ID=您的Channel_ID<br>LINE_CLIENT_SECRET=您的Channel_Secret</code></li>
      </ol>
    `,
  }
  return contents[provider] || '沒有可用的說明內容'
}
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 450px;
  margin: 50px auto;
  width: 90%;
}

/* 添加全頁面樣式 */
:deep(body) {
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 0; /* 移除底部間距，改用 gap */
}

.logout-button {
  background-color: #f44336;
  color: white;
  margin-top: 16px;
  font-weight: 600;
}

.logout-button:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
}

.debug-button {
  background-color: #2196f3;
  color: white;
  margin-bottom: 16px;
  font-weight: 600;
}

.debug-button:hover {
  background-color: #1976d2;
  transform: translateY(-2px);
}

.logout-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.profile-container {
  width: 100%;
  background-color: #f9fafc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

.buttons-container {
  width: 100%;
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 3px solid #4285f4;
  box-shadow: 0 3px 8px rgba(66, 133, 244, 0.3);
}

.user-avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 15px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.user-provider {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

.user-provider::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #4caf50;
  border-radius: 50%;
  margin-right: 8px;
}

.user-id {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px 0;
  word-break: break-all;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.user-email {
  font-size: 13px;
  color: #666;
  margin: 0;
  word-break: break-all;
  display: flex;
  align-items: center;
}

.user-email::before {
  content: '✉';
  margin-right: 8px;
  font-size: 14px;
}

.loading-state {
  padding: 30px 15px;
  color: #666;
  font-style: italic;
  text-align: center;
  width: 100%;
}

.loading-state p {
  position: relative;
  display: inline-block;
}

.loading-state p::after {
  content: '...';
  position: absolute;
  animation: loadingDots 1.5s infinite;
  width: 24px;
  text-align: left;
}

@keyframes loadingDots {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
}

/* 添加標題與連結的容器樣式 */
.title-with-link {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  margin-bottom: 24px;
}

.page-title {
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.github-link {
  position: absolute;
  top: -15px;
  right: -15px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #333;
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: #f0f0f0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.github-link:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #24292e, #1b1f23);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
}

.github-link:hover {
  color: #fff;
  transform: translateY(-5px) scale(1.1) rotate(5deg);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.github-link:hover:before {
  opacity: 1;
}

.github-link-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.5s ease;
}

.github-link:hover .github-link-icon {
  transform: rotate(360deg);
}

/* 響應式調整 */
@media (max-width: 480px) {
  .auth-container {
    padding: 15px;
    margin: 20px auto;
  }

  .user-avatar {
    width: 45px;
    height: 45px;
  }

  .user-name,
  .user-provider,
  .user-id,
  .user-email {
    font-size: 12px;
  }

  .github-link {
    width: 28px;
    height: 28px;
  }

  .github-link-icon {
    width: 16px;
    height: 16px;
  }
}

/* 添加按鈕與說明組合樣式 */
.button-with-help {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.help-button {
  position: absolute;
  right: -40px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f0f0;
  color: #666;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.help-button:hover {
  background-color: #e0e0e0;
  color: #333;
  transform: scale(1.1);
}

/* 說明模態視窗樣式 */
.help-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.help-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

.help-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.help-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.close-button:hover {
  color: #333;
}

.help-modal-content {
  padding: 20px;
  color: #555;
  line-height: 1.6;
}

.help-modal-content h4 {
  color: #333;
  margin-top: 0;
  margin-bottom: 16px;
}

.help-modal-content ol {
  padding-left: 20px;
}

.help-modal-content li {
  margin-bottom: 10px;
}

.help-modal-content code {
  background-color: #f5f5f5;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  color: #e91e63;
}

.help-modal-content a {
  color: #2196f3;
  text-decoration: none;
}

.help-modal-content a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .help-button {
    width: 24px;
    height: 24px;
    font-size: 14px;
    right: -30px;
  }

  .help-modal {
    width: 95%;
    max-height: 90vh;
  }
}
</style>
