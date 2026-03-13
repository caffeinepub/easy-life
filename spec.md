# Easy Life

## Current State
The AdminPage manages products using local React state only -- no backend connection. Products are seeded from a local `data/products` file. The product form has name, price, description, category, and stock fields. Image is stored as a URL string. No bulk delete. The backend has `addProduct`, `updateProduct`, `deleteProduct`, `getProducts` APIs and blob-storage for file uploads.

## Requested Changes (Diff)

### Add
- Bulk delete: "Select All" checkbox in product table header; per-row checkboxes; a "Delete Selected" button that appears when any rows are selected; confirmation before bulk delete
- Device image upload in product form: file input that uploads the image to blob-storage and stores the returned URL
- Connect AdminPage to real backend: load products via `getProducts`, save via `addProduct`/`updateProduct`, delete via `deleteProduct`

### Modify
- Product form image field: replace plain URL text input with a file upload button (device picker) that uploads to blob-storage
- Product list: add checkbox column for selection; show "Delete Selected (N)" button when items are checked

### Remove
- Local INITIAL_PRODUCTS state seed in AdminPage (products come from backend)

## Implementation Plan
1. Update AdminPage to call `backend.getProducts()` on mount and manage products from backend state
2. Wire addProduct form to `backend.addProduct(...)` and updateProduct to `backend.updateProduct(...)`
3. Wire per-row delete to `backend.deleteProduct(id)`
4. Add checkbox column with Select All; track `selectedIds` state; show "Delete Selected" button; bulk delete calls `deleteProduct` for each selected id
5. Replace image URL input with a file upload input that uses blob-storage `uploadBlob` to upload and retrieve a URL, then stores that URL in the form
