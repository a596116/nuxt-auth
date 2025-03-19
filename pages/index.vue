<template>
  <div class="auth-container">
    <div v-if="isLoading" class="loading-state">
      <p>載入中...</p>
    </div>
    <div v-else-if="!isAuthenticated" class="login-buttons">
      <GoogleLoginButton />
      <FacebookLoginButton />
      <LineLoginButton />
      <GitHubLoginButton />
      <AppleLoginButton />
    </div>
    <div v-else class="profile-container">
      <div class="user-info">
        <img
          v-if="data?.user?.image"
          :src="data.user.image"
          alt="使用者頭像"
          class="user-avatar"
        />
        <div class="user-details">
          <p class="user-name">已登入為: {{ data?.user?.name }}</p>
          <p class="user-provider" v-if="data?.user?.provider">
            來源: {{ getProviderName(data?.user?.provider) }}
          </p>
          <p class="user-id">用戶 ID: {{ getUserId }}</p>
          <p v-if="userEmail" class="user-email">Email: {{ userEmail }}</p>
        </div>
      </div>
      <div class="buttons-container">
        <button class="auth-button debug-button" @click="showSessionData">
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
</script>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 0 auto;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.auth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.logout-button {
  background-color: #f44336;
  color: white;
  margin-top: 10px;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.debug-button {
  background-color: #2196f3;
  color: white;
  margin-bottom: 10px;
}

.debug-button:hover {
  background-color: #1976d2;
}

.logout-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.profile-container {
  width: 100%;
}

.buttons-container {
  width: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  border: 2px solid #4285f4;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 14px;
  color: #333;
  margin: 0 0 5px 0;
}

.user-provider {
  font-size: 12px;
  color: #666;
  margin: 0 0 5px 0;
}

.user-id {
  font-size: 12px;
  color: #666;
  margin: 0 0 5px 0;
  word-break: break-all;
}

.user-email {
  font-size: 12px;
  color: #666;
  margin: 0;
  word-break: break-all;
}

.loading-state {
  padding: 15px;
  color: #666;
  font-style: italic;
}
</style>
