import supabase from '../supabase'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('Orders', {
  state: () => ({
    orders: [],
    loading: false,
  }),
	actions: {
    async fetchOrders() {
      this.loading = true
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      this.orders = data
      this.loading = false
      return data
    },

    async searchOrders(query) {
      this.loading = true

      if (!query) {
        return await this.fetchOrders()
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .textSearch('fts', query, {
					config: 'english',
					type: 'websearch'
				})
      if (error) throw error
      this.orders = data
      this.loading = false
    },

    async updateOrderStatus(orderId, newStatus) {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      const order = this.orders.find(o => o.id === orderId)
      if (order) order.status = newStatus

    },
	}
})