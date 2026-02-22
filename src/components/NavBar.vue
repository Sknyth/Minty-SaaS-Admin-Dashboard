<script>
import { useToast } from "vue-toastification"
import { useAuthStore } from '../stores/authStore'

export default {
  setup() {
    const toast = useToast()
    const authStore = useAuthStore()
    return { toast, authStore }
  },
  methods: {
    logout() {
      try{
        this.authStore.signOut()
        this.toast.success("Successful exit!")
      } catch(e){
        this.toast.error("Error: " + e.message)
      }
    }
  }
}
</script>

<template>
  <div class="container-fluid p-0">
    <div class="d-flex">
      <nav id="sidebar" class="sidebar bg-dark min-vh-100 position-fixed">
        <div class="pt-4 px-3">
          <h4 class="text-white mb-4 fw-bold">Minty <span class="color1">Admin</span></h4>
          
          <ul class="nav flex-column gap-2">
            <li class="nav-item">
              <router-link class="nav-link admin-link" to="/">
                <i class="bi bi-speedometer2 me-2"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link admin-link" to="/products">
                <i class="bi bi-box-seam me-2"></i> Products
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link admin-link" to="/orders">
                <i class="bi bi-receipt me-2"></i> Orders
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link admin-link" to="/users">
                <i class="bi bi-people me-2"></i> Users
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <main class="main-wrapper flex-grow-1">
        <header class="header-nav d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-white">
          <button class="btn btn-danger" id="btn-logout" @click="logout">Logout</button>
          <h2 class="h4 m-0 fw-bold">Admin Panel</h2>
          <div class="user-profile d-flex align-items-center gap-3">
            <span class="color3">Administrator</span>
            <div class="avatar bg-color1">A</div>
          </div>
        </header>
        <div class="p-4">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 300px;
  z-index: 1000;
  background-color: #1a1a1a !important;
}

.main-wrapper {
  margin-left: 300px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.admin-link {
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 15px;
  transition: all 0.3s ease;
}

.admin-link:hover {
  background: rgba(45, 138, 114, 0.1);
  color: var(--color1);
}

.admin-link.router-link-active {
  background-color: var(--color1) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(45, 138, 114, 0.3);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.header-nav {
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>
