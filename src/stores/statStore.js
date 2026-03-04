import supabase from '../supabase'
import { defineStore } from 'pinia'

export const useStatStore = defineStore('stats', {
  state: () => ({
    totalEarnings: 0,
    totalOrders: 0,
    chartLabels: [],
    chartData: [],
    orders: [],
    loading: false,
  }),
  actions: {
    async fetchEarnings() {
      this.loading = true

      const { data, error } = await supabase
        .from('orders')
        .select('total_price')

      if (error) throw error

      this.totalEarnings = data.reduce((acc, order) => acc + order.total_price, 0)

      this.loading = false
    },
    getStartOfMonth() {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    },

    async fetchOrdersChart() {
      this.loading = true
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDay)

      this.totalOrders = count || 0

      const { data, error } = await supabase
        .from('orders')
        .select('created_at')
        .gte('created_at', firstDay)
        .order('created_at', { ascending: true })

      if (error) return console.error(error)

      const stats = {}
      for (let d = 1; d <= now.getDate(); d++) {
        stats[d] = 0
      }

      data.forEach(order => {
        const day = new Date(order.created_at).getDate()
        if (stats[day] !== undefined) stats[day]++
      })

      this.chartLabels = Object.keys(stats)
      this.chartData = Object.values(stats)
      this.loading = false
    },

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
        .textSearch('id_text_search', query, {
          config: 'simple',
          type: 'phrase'
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