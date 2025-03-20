<template>
  <div class="credentials-manager">
    <button class="creds-button" @click="showModal = true">
      <svg class="creds-icon" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
        />
      </svg>
      設定登入憑證
    </button>
    <div class="creds-info">
      <span>憑證僅保存於本地瀏覽器，僅供開發測試使用</span>
    </div>

    <div
      v-if="showModal"
      class="creds-modal-overlay"
      @click="showModal = false"
    >
      <div class="creds-modal" @click.stop>
        <div class="creds-modal-header">
          <h3>設定第三方登入憑證</h3>
          <button class="close-button" @click="showModal = false">×</button>
        </div>

        <div class="creds-modal-content">
          <div class="creds-tabs">
            <button
              v-for="provider in providers"
              :key="provider.id"
              :class="['tab-button', { active: activeTab === provider.id }]"
              @click="activeTab = provider.id"
            >
              {{ provider.name }}
            </button>
          </div>

          <div class="creds-form">
            <template v-if="activeTab === 'google'">
              <div class="setup-instructions">
                <h4>Google 登入設定步驟</h4>
                <ol>
                  <li>
                    前往
                    <a href="https://console.cloud.google.com/" target="_blank"
                      >Google Cloud Console</a
                    >
                  </li>
                  <li>創建一個新專案或選擇現有專案</li>
                  <li>在左側導航欄選擇「API 和服務」>「憑證」</li>
                  <li>點擊「建立憑證」>「OAuth 用戶端 ID」</li>
                  <li>
                    設置授權重定向 URI:
                    <code>http://localhost:3000/api/auth/callback/google</code>
                  </li>
                  <li>取得 Client ID 和 Client Secret</li>
                </ol>
              </div>
              <div class="form-group">
                <label for="google-client-id">Google Client ID</label>
                <input
                  id="google-client-id"
                  v-model="credentials.google.clientId"
                  type="text"
                  placeholder="輸入 Google Client ID"
                />
              </div>
              <div class="form-group">
                <label for="google-client-secret">Google Client Secret</label>
                <input
                  id="google-client-secret"
                  v-model="credentials.google.clientSecret"
                  type="password"
                  placeholder="輸入 Google Client Secret"
                />
              </div>
            </template>

            <template v-else-if="activeTab === 'github'">
              <div class="setup-instructions">
                <h4>GitHub 登入設定步驟</h4>
                <ol>
                  <li>
                    前往
                    <a
                      href="https://github.com/settings/developers"
                      target="_blank"
                      >GitHub Developer Settings</a
                    >
                  </li>
                  <li>選擇「OAuth Apps」，點擊「New OAuth App」</li>
                  <li>
                    填寫應用名稱和回調 URL：<code
                      >http://localhost:3000/api/auth/callback/github</code
                    >
                  </li>
                  <li>註冊應用後取得 Client ID</li>
                  <li>生成一個新的 Client Secret</li>
                </ol>
              </div>
              <div class="form-group">
                <label for="github-client-id">GitHub Client ID</label>
                <input
                  id="github-client-id"
                  v-model="credentials.github.clientId"
                  type="text"
                  placeholder="輸入 GitHub Client ID"
                />
              </div>
              <div class="form-group">
                <label for="github-client-secret">GitHub Client Secret</label>
                <input
                  id="github-client-secret"
                  v-model="credentials.github.clientSecret"
                  type="password"
                  placeholder="輸入 GitHub Client Secret"
                />
              </div>
            </template>

            <template v-else-if="activeTab === 'apple'">
              <div class="setup-instructions">
                <h4>Apple 登入設定步驟</h4>
                <ol>
                  <li>
                    前往
                    <a
                      href="https://developer.apple.com/account/resources/identifiers/list"
                      target="_blank"
                      >Apple Developer Portal</a
                    >
                  </li>
                  <li>創建一個新的應用程式 ID</li>
                  <li>啟用「Sign In with Apple」功能</li>
                  <li>配置 Service ID 並註冊網域</li>
                  <li>生成私鑰並下載</li>
                </ol>
              </div>
              <div class="form-group">
                <label for="apple-client-id">Apple Client ID</label>
                <input
                  id="apple-client-id"
                  v-model="credentials.apple.clientId"
                  type="text"
                  placeholder="輸入 Apple Client ID"
                />
              </div>
              <div class="form-group">
                <label for="apple-client-secret">Apple Client Secret</label>
                <input
                  id="apple-client-secret"
                  v-model="credentials.apple.clientSecret"
                  type="password"
                  placeholder="輸入 Apple Client Secret"
                />
              </div>
              <div class="form-group">
                <label for="apple-team-id">Apple Team ID</label>
                <input
                  id="apple-team-id"
                  v-model="credentials.apple.teamId"
                  type="text"
                  placeholder="輸入 Apple Team ID"
                />
              </div>
              <div class="form-group">
                <label for="apple-key-id">Apple Key ID</label>
                <input
                  id="apple-key-id"
                  v-model="credentials.apple.keyId"
                  type="text"
                  placeholder="輸入 Apple Key ID"
                />
              </div>
            </template>

            <template v-else-if="activeTab === 'facebook'">
              <div class="setup-instructions">
                <h4>Facebook 登入設定步驟</h4>
                <ol>
                  <li>
                    前往
                    <a href="https://developers.facebook.com/" target="_blank"
                      >Facebook Developers</a
                    >
                  </li>
                  <li>創建一個新應用程式</li>
                  <li>添加「Facebook 登入」產品</li>
                  <li>
                    在設定中添加重定向 URI：<code
                      >http://localhost:3000/api/auth/callback/facebook</code
                    >
                  </li>
                  <li>取得應用程式 ID 和密鑰</li>
                </ol>
              </div>
              <div class="form-group">
                <label for="facebook-client-id">Facebook Client ID</label>
                <input
                  id="facebook-client-id"
                  v-model="credentials.facebook.clientId"
                  type="text"
                  placeholder="輸入 Facebook Client ID"
                />
              </div>
              <div class="form-group">
                <label for="facebook-client-secret"
                  >Facebook Client Secret</label
                >
                <input
                  id="facebook-client-secret"
                  v-model="credentials.facebook.clientSecret"
                  type="password"
                  placeholder="輸入 Facebook Client Secret"
                />
              </div>
            </template>

            <template v-else-if="activeTab === 'line'">
              <div class="setup-instructions">
                <h4>Line 登入設定步驟</h4>
                <ol>
                  <li>
                    前往
                    <a
                      href="https://developers.line.biz/console/"
                      target="_blank"
                      >Line Developers Console</a
                    >
                  </li>
                  <li>創建一個提供者和新頻道</li>
                  <li>選擇「LINE Login」作為頻道類型</li>
                  <li>
                    添加回調 URL：<code
                      >http://localhost:3000/api/auth/callback/line</code
                    >
                  </li>
                  <li>設置所需權限：profile, openid, email</li>
                  <li>取得 Channel ID 和 Channel Secret</li>
                </ol>
              </div>
              <div class="form-group">
                <label for="line-client-id">Line Client ID</label>
                <input
                  id="line-client-id"
                  v-model="credentials.line.clientId"
                  type="text"
                  placeholder="輸入 Line Client ID"
                />
              </div>
              <div class="form-group">
                <label for="line-client-secret">Line Client Secret</label>
                <input
                  id="line-client-secret"
                  v-model="credentials.line.clientSecret"
                  type="password"
                  placeholder="輸入 Line Client Secret"
                />
              </div>
            </template>
          </div>

          <div class="creds-actions">
            <button class="save-button" @click="saveCredentials">
              保存憑證
            </button>
            <button class="reset-button" @click="resetCredentials">重置</button>
          </div>

          <div
            v-if="message"
            :class="[
              'message',
              {
                success: messageType === 'success',
                error: messageType === 'error',
              },
            ]"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const showModal = ref(false)
const activeTab = ref('google')
const message = ref('')
const messageType = ref('')

const providers = [
  { id: 'google', name: 'Google' },
  { id: 'github', name: 'GitHub' },
  { id: 'apple', name: 'Apple' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'line', name: 'Line' },
]

const credentials = reactive({
  google: { clientId: '', clientSecret: '' },
  github: { clientId: '', clientSecret: '' },
  apple: { clientId: '', clientSecret: '', teamId: '', keyId: '' },
  facebook: { clientId: '', clientSecret: '' },
  line: { clientId: '', clientSecret: '' },
})

// 載入已保存的憑證（如果有）
onMounted(() => {
  const savedCreds = localStorage.getItem('auth_credentials')
  if (savedCreds) {
    try {
      const parsed = JSON.parse(savedCreds)
      Object.keys(parsed).forEach((provider) => {
        if (credentials[provider]) {
          Object.assign(credentials[provider], parsed[provider])
        }
      })
    } catch (e) {
      console.error('解析保存的憑證時出錯:', e)
    }
  }
})

// 保存憑證
async function saveCredentials() {
  try {
    // 在本地保存一份（用於表單回填）
    localStorage.setItem('auth_credentials', JSON.stringify(credentials))

    // 發送到後端保存在 cookie 中
    const response = await fetch('/api/saveCredentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const result = await response.json()

    if (result.success) {
      message.value = '憑證已成功保存！請重新載入頁面以應用變更。'
      messageType.value = 'success'

      // 3秒後自動重載頁面以應用新憑證
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } else {
      throw new Error(result.message || '保存失敗')
    }
  } catch (error) {
    message.value = `保存憑證時出錯: ${error.message}`
    messageType.value = 'error'
  }

  // 5秒後清除訊息
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

// 重置當前提供商的憑證
function resetCredentials() {
  const provider = activeTab.value
  if (provider === 'apple') {
    credentials[provider] = {
      clientId: '',
      clientSecret: '',
      teamId: '',
      keyId: '',
    }
  } else {
    credentials[provider] = { clientId: '', clientSecret: '' }
  }

  message.value = `已重置 ${provider} 憑證`
  messageType.value = 'success'

  // 3秒後清除訊息
  setTimeout(() => {
    message.value = ''
  }, 3000)
}
</script>

<style scoped>
.credentials-manager {
  margin-top: 20px;
}

.creds-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.creds-button:hover {
  background-color: #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.creds-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.creds-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.creds-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 650px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
}

.creds-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.creds-modal-header h3 {
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

.creds-modal-content {
  padding: 20px;
  overflow-x: hidden;
}

.creds-tabs {
  display: flex;
  margin-bottom: 20px;
  overflow-x: auto;
  border-bottom: 1px solid #eee;
}

.tab-button {
  padding: 10px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button.active {
  color: #1a73e8;
  border-bottom-color: #1a73e8;
  font-weight: 500;
}

.setup-instructions {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #4285f4;
  word-break: break-word;
  max-width: 100%;
}

.setup-instructions h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.setup-instructions ol {
  margin: 0;
  padding-left: 18px;
}

.setup-instructions li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
}

.setup-instructions a {
  color: #1a73e8;
  text-decoration: none;
}

.setup-instructions a:hover {
  text-decoration: underline;
}

.setup-instructions code {
  background-color: #f1f3f4;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
  color: #e91e63;
  white-space: normal;
  word-break: break-all;
  display: inline-block;
  max-width: 100%;
}

.creds-form {
  max-width: 100%;
  box-sizing: border-box;
  padding: 0 5px;
}

.form-group {
  margin-bottom: 16px;
  max-width: 100%;
  box-sizing: border-box;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
  word-break: break-word;
}

.form-group input {
  width: 100%;
  max-width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  border-color: #1a73e8;
  outline: none;
}

.creds-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  gap: 12px;
}

.save-button {
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #1558b7;
}

.reset-button {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #e8eaed;
}

.message {
  margin-top: 16px;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.message.success {
  background-color: #e6f4ea;
  color: #137333;
  border: 1px solid #ceead6;
}

.message.error {
  background-color: #fce8e6;
  color: #c5221f;
  border: 1px solid #f6c9c5;
}

.creds-info {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
  text-align: center;
  max-width: 240px;
  line-height: 1.5;
}

@media (max-width: 480px) {
  .creds-tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-group input {
    padding: 8px;
    font-size: 13px;
  }

  .save-button,
  .reset-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .setup-instructions {
    padding: 10px;
  }

  .setup-instructions h4 {
    font-size: 15px;
  }

  .setup-instructions li {
    font-size: 13px;
  }

  .setup-instructions code {
    font-size: 11px;
    padding: 1px 3px;
  }

  .creds-info {
    font-size: 11px;
    max-width: 200px;
  }
}
</style>
