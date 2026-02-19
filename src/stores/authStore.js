import supabase from '../supabase'
import { defineStore } from 'pinia'
import router from '../router'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		profile: null,
		isAuth: false,
	}),
	actions: {
		async signIn({ email, password }) {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			})
			if (error) throw error

			this.user = data.user
			this.isAuth = !!this.user
			if (!this.user) this.profile = null

			await this.getUser()

		},
		async signOut() {
			const { error } = await supabase.auth.signOut()
			if (error) throw error
			this.user = null
			router.push('/login')
		},
		async getUser() {
			const { data: { session } } = await supabase.auth.getSession()

			if (!session) {
				this.user = null
				this.profile = null
				return
			}

			const user = session.user
			this.user = user

			const { data: profile } = await supabase
				.from('profiles')
				.select('role')
				.eq('id', this.user.id)
				.single()

			if (profile?.role === 'admin') {
				this.profile = profile
				router.push('/')
			} else {
				await this.signOut()
				throw new Error('You are not an administrator')
			}

			if (profile) {
				this.profile = profile
			}
		},
	}
})