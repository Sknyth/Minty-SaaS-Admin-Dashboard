<script>
import { useToast } from "vue-toastification"
import NavBar from '../components/NavBar.vue'
import { useStatStore } from '../stores/statStore'

export default {
  components: { NavBar },
  setup() {
    const statStore = useStatStore()
    const toast = useToast()

    statStore.fetchOrders()

    return { statStore, toast }
  },
  data() {
    return {
      orderSearchQuery: ''
    }
  },

  methods: {
    async handleStatusChange(orderId, newStatus) {
      try {
        await this.statStore.updateOrderStatus(orderId, newStatus)
        this.toast.success(`Order updated to ${newStatus}`)
      } catch (error) {
        this.toast.error('Failed to update: ' + error.message)
        this.statStore.fetchOrders()
      }
    }
  }
}
</script>

<template>
  <NavBar>
    <div class="header-section d-flex justify-content-between align-items-center mb-4">
      <h1 class="fw-bold">Orders Management</h1>

      <div class="search-container w-100">
        <input type="text" placeholder="Search id order" class="form-control custom-input mb-3" v-model="orderSearchQuery" @keyup="statStore.searchOrders(orderSearchQuery)" />
      </div>

      <div class="stats-mini d-flex justify-content-end">
        <span class="text-muted">Total records:</span> 
        <span class="fw-bold color1 ms-1">{{ statStore.orders.length }}</span>
      </div>
    </div>

    
    
    <div class="panel shadow-sm p-0 overflow-hidden">
      <div class="table-responsive">
        <table class="custom-table w-full">
          <thead>
            <tr>
              <th class="px-4 py-3">Order ID</th>
              <th class="px-4 py-3">Customer</th>
              <th class="px-4 py-3 text-center">Total</th>
              <th class="px-4 py-3 text-center">Status</th>
              <th class="px-4 py-3 text-end">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in statStore.orders" :key="order.id" class="table-row">
              <td class="px-4 py-3 fw-bold">#{{ order.id.slice(0, 8) }}</td>
              <td class="px-4 py-3">
                <div class="d-flex flex-column">
                  <span class="fw-bold">{{ order.customer_name }} {{ order.customer_surname }}</span>
                  <span class="text-muted small">{{ order.email }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-center fw-bold color1">
                ${{ order.total_price }}
              </td>
              <td class="px-3 py-2 text-center">
                <div class="status-select-container">
                  <select 
                    :value="order.status" 
                    @change="handleStatusChange(order.id, $event.target.value)"
                    :class="['status-select-custom', order.status.toLowerCase()]"
                  >
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <i class="bi bi-chevron-down select-icon"></i>
                </div>
              </td>
              <td class="px-4 py-3 text-end text-muted small">
                {{ order.created_at ? new Date(order.created_at).toLocaleDateString() : '—' }}
              </td>
            </tr>
            <tr v-if="statStore.orders.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">
                No orders found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </NavBar>
</template>

<style scoped>
h1, .stats-mini {
  width: 400px;
}
.search-container{
  max-width: 400px;
}

.panel {
  background: #ffffff;
  border: 1px solid rgba(134, 134, 149, 0.15);
  border-radius: 18px;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table thead {
  background: #f8fafb;
  border-bottom: 1px solid rgba(134, 134, 149, 0.1);
}

.custom-table th {
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color3);
}

.table-row {
  transition: background 0.2s ease;
  border-bottom: 1px solid rgba(134, 134, 149, 0.05);
}

.table-row:hover {
  background: rgba(45, 138, 114, 0.03);
}

.table-row:last-child {
  border-bottom: none;
}

.status-select-container {
  position: relative;
  display: inline-block;
  width: 130px;
}

.status-select-custom {
  appearance: none;
  width: 100%;
  padding: 4px 25px 4px 12px;
  font-weight: 700;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.2s ease;
}

.select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  pointer-events: none;
  opacity: 0.6;
}

.status-select-custom.delivered {
  background-color: #D4EDDA;
  color: #155724;
}

.status-select-custom.pending {
  background-color: #FFF3CD;
  color: #856404;
}

.status-select-custom.cancelled {
  background-color: #F8D7DA;
  color: #721C24;
}
.status-select-custom.delivered:hover, .status-select-custom.delivered:focus {
  box-shadow: 0 0 0 2px var(--color1);
}
.status-select-custom.pending:hover, .status-select-custom.pending:focus {
  box-shadow: 0 0 0 2px var(--color2);
}
.status-select-custom.cancelled:hover, .status-select-custom.cancelled:focus {
  box-shadow: 0 0 0 2px #dc3545;
}
</style>