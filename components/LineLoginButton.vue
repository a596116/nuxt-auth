<template>
  <button class="auth-button login-button line-button" @click="handleLogin">
    <svg
      class="line-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        d="M22 10.781c0-4.855-4.867-8.809-10.845-8.809-5.977 0-10.843 3.954-10.843 8.809 0 4.357 3.864 8.008 9.073 8.697.377.082.881.252.996.578.102.297.067.761.033 1.060 0 0-.142.843-.172 1.021-.057.295-.262 1.154 1.012.63 1.274-.523 6.875-4.048 9.382-6.926h-.001c1.724-1.903 2.363-3.844 2.365-5.060zm-14.737 3.896H5.257c-.276 0-.5-.224-.5-.5v-4.596c0-.276.224-.5.5-.5s.5.224.5.5v4.096h1.506c.276 0 .5.224.5.5s-.224.5-.5.5zm2.639-.5c0 .275-.225.5-.5.5s-.5-.225-.5-.5v-4.596c0-.276.224-.5.5-.5s.5.224.5.5v4.596zm5.595 0c0 .212-.134.401-.336.471-.05.017-.1.025-.151.025-.153 0-.302-.075-.392-.206l-2.093-3.013v2.724c0 .275-.224.5-.5.5s-.5-.225-.5-.5v-4.596c0-.212.133-.402.335-.472.05-.017.101-.025.152-.025.152 0 .301.076.391.207l2.093 3.013V9.181c0-.276.225-.5.5-.5s.5.224.5.5v4.996h.001zm4.008-3.868c.276 0 .5.224.5.5s-.224.5-.5.5h-1.507v.871h1.507c.276 0 .5.225.5.5s-.224.5-.5.5h-1.507v.872H19.5c.276 0 .5.224.5.5s-.224.5-.5.5h-2.007c-.276 0-.5-.224-.5-.5v-4.596c0-.276.224-.5.5-.5H19.5c.276 0 .5.224.5.5s-.224.5-.5.5h-1.507v.853h1.507z"
        fill="#FFFFFF"
      />
    </svg>
    使用 Line 登入
  </button>
</template>

<script setup lang="ts">
import { useAuth } from '#imports'

const { signIn } = useAuth()

const handleLogin = () => {
  signIn('line', {
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

.line-button {
  background: linear-gradient(to bottom, #06c755, #00b83f);
  color: white;
  border: 1px solid #06c755;
  font-family: Helvetica, Arial, sans-serif;
}

.line-button:hover {
  background: linear-gradient(to bottom, #00b83f, #00a835);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.line-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}
</style>
