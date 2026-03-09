<script>
import { useToast } from "vue-toastification"
import { useProductsStore } from '../stores/productStore'
export default {
	props: {
		product: {
			type: Object,
			required: true
		},
		BTNname: {
			type: String,
			default: 'Edit'
		}
	},
	setup() {
		const toast = useToast()
		const productsStore = useProductsStore()
		return { toast, productsStore }

	},
	data() {
		return {
			editingProduct: {
				id: this.product.id || '',
				name: this.product.name || '',
				price: this.product.price || '',
				description: this.product.description || '',
				image_url: this.product.image_url || '',
				sizes: this.product.sizes || []
			},
			sizesInput: (this.product.sizes && Array.isArray(this.product.sizes)) ? this.product.sizes.join(', ') : ''
		}
	},
	methods: {
		async handleSaveProduct() {
			try {
				const updatedData = {
					name: this.editingProduct.name,
					price: parseFloat(this.editingProduct.price),
					description: this.editingProduct.description,
					image_url: this.editingProduct.image_url,
					sizes: this.sizesInput.split(',').map(s => s.trim()).filter(s => s)
				}
				await this.productsStore.updateProduct(this.editingProduct.id, updatedData)
				this.toast.success('Product updated successfully')
			} catch (error) {
				this.toast.error('Error: ' + error.message)
				alert('Error: ' + error.message)
			}
		}
	}
}
</script>

<template>
	<button type="button" class="btn btn-sm btn-outline-primary me-2 btn-open" data-bs-toggle="modal" data-bs-target="#exampleModal">
		{{ BTNname }}
	</button>

	<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title fw-bold" id="exampleModalLabel">Edit Product</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
          <div class="mb-3">
            <label class="form-label fw-bold text-start d-block">Product Name</label>
            <input type="text" class="form-control" v-model="editingProduct.name" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-start d-block">Price</label>
            <input type="number" class="form-control" v-model="editingProduct.price" step="0.01" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-start d-block">Image URL</label>
            <input type="text" class="form-control" v-model="editingProduct.image_url" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-start d-block">Description</label>
            <textarea class="form-control" v-model="editingProduct.description" rows="3"></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-start d-block">Sizes (comma-separated)</label>
            <input type="text" class="form-control" v-model="sizesInput" placeholder="e.g., S, M, L, XL" />
          </div>
        </div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
					<button type="button" class="button-color3" data-bs-dismiss="modal" @click="handleSaveProduct">Save changes</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.btn-close, .btn-open{
	--bs-btn-close-focus-shadow: none;
}
.button-color3{
	padding: 9px;
}
</style>