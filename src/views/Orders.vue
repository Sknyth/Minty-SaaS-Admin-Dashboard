<script>
import NavBar from '../components/NavBar.vue'
import { useStatStore } from '../stores/statStore'

export default {
  components: { NavBar },
  setup() {
    const statStore = useStatStore()
    statStore.fetchOrders()
    return { statStore }
  },
}
</script>

<template>
  <NavBar>
    <div class="header-section d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Orders Management</h1>
      <div class="stats-mini">
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
              <td class="px-4 py-3 fw-bold">#{{ order.id.toString().slice(-6) }}</td>
              <td class="px-4 py-3">
                <div class="d-flex flex-column">
                  <span class="fw-bold">{{ order.customer_name }} {{ order.customer_surname }}</span>
                  <span class="text-muted small">{{ order.email }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-center fw-bold color1">
                ${{ order.total_price }}
              </td>
              <td class="px-4 py-3 text-center">
                <span :class="['status-badge', order.status.toLowerCase()]">
                  {{ order.status }}
                </span>
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
.page-title {
  font-weight: 700;
  color: #2c2c2c;
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

.status-badge {
  padding: 5px 12px;
  border-radius: 8px;
  font-weight: 700;
  display: inline-block;
  text-transform: capitalize;
}

.status-badge.paid, .status-badge.completed {
  background: rgba(45, 138, 114, 0.12);
  color: var(--color1);
}

.status-badge.pending {
  background: rgba(255, 228, 181, 0.3);
  color: #d97706;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.color1 {
  color: var(--color1);
}
</style>