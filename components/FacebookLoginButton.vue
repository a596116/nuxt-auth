<template>
  <button class="auth-button login-button facebook-button" @click="handleLogin">
    <svg
      class="facebook-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#FFFFFF"
      />
    </svg>
    使用 Facebook 登入
  </button>
</template>

<script setup lang="ts">
import { useAuth } from '#imports'

const { signIn } = useAuth()

const handleLogin = () => {
  signIn('facebook', {
    callbackUrl: window.location.origin,
  })
}
</script>

<style scoped>
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
  margin-bottom: 10px;
}

.login-button {
  background-color: white;
  color: #757575;
  border: 1px solid #dadce0;
}

.facebook-button {
  background: linear-gradient(to bottom, #1877f2, #166fe5);
  color: white;
  border: 1px solid #1877f2;
  font-family: Helvetica, Arial, sans-serif;
}

.facebook-button:hover {
  background: linear-gradient(to bottom, #166fe5, #155fd1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.facebook-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}
</style>
