// Product slice for Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../../utils/api'

// Async thunks for API calls
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.product.getAll()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.product.getById(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchProductsByCategory = createAsyncThunk(
  'product/fetchProductsByCategory',
  async ({ categoryId, page, size }, { rejectWithValue }) => {
    try {
      const response = await apiService.product.getByCategory(categoryId, page, size)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await apiService.product.create(productData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await apiService.product.update(id, productData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.product.delete(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await apiService.product.search(searchParams)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Initial state
const initialState = {
  products: [],
  selectedProduct: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchResults: [],
  searchStatus: 'idle',
  searchError: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchStatus = 'idle'
      state.searchError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch products'
      })
      
      // Handle fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch product'
      })
      
      // Handle fetchProductsByCategory
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.products = action.payload.content || action.payload
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch products by category'
      })
      
      // Handle createProduct
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload)
      })
      
      // Handle updateProduct
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload
        }
      })
      
      // Handle deleteProduct
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(product => product.id !== action.payload)
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null
        }
      })
      
      // Handle searchProducts
      .addCase(searchProducts.pending, (state) => {
        state.searchStatus = 'loading'
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded'
        state.searchResults = action.payload.content || action.payload
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchStatus = 'failed'
        state.searchError = action.payload || 'Failed to search products'
      })
  },
})

// Export actions and reducer
export const { clearSelectedProduct, clearSearchResults } = productSlice.actions
export default productSlice.reducer

// Selectors
export const selectAllProducts = (state) => state.product.products
export const selectProductById = (state) => state.product.selectedProduct
export const selectProductStatus = (state) => state.product.status
export const selectProductError = (state) => state.product.error
export const selectSearchResults = (state) => state.product.searchResults
export const selectSearchStatus = (state) => state.product.searchStatus