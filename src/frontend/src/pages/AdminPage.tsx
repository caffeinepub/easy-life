import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type Currency, useCurrency } from "../context/CurrencyContext";
import { CATEGORIES, type Category } from "../data/products";
import { useActor } from "../hooks/useActor";

const MOCK_ORDERS = [
  {
    id: "EL-483920",
    customer: "Jane Smith",
    date: "Mar 8, 2026",
    total: 174.97,
    status: "Delivered",
    items: 3,
  },
  {
    id: "EL-391847",
    customer: "Mark Johnson",
    date: "Feb 22, 2026",
    total: 49.99,
    status: "Shipped",
    items: 1,
  },
  {
    id: "EL-275634",
    customer: "Lisa Chen",
    date: "Jan 15, 2026",
    total: 89.98,
    status: "Delivered",
    items: 2,
  },
  {
    id: "EL-198452",
    customer: "David Park",
    date: "Mar 11, 2026",
    total: 229.96,
    status: "Processing",
    items: 4,
  },
];

type BackendProduct = {
  id: bigint;
  name: string;
  description: string;
  priceInCents: bigint;
  category: string;
  imageUrl: string;
  stock: bigint;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: Category;
  stock: string;
  image: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  stock: "",
  image: "",
};

const CHUNK_SIZE = 1024 * 1024; // 1MB

export default function AdminPage() {
  const { actor, isFetching } = useActor();
  const { format, currency, setCurrency } = useCurrency();
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<BackendProduct | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<bigint>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);

  const loadProducts = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await (actor as any).getProducts();
      setProducts(result);
    } catch (e) {
      toast.error("Failed to load products");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !isFetching) {
      loadProducts();
    }
  }, [actor, isFetching, loadProducts]);

  const openAdd = () => {
    setForm(emptyForm);
    setIsAddOpen(true);
  };

  const openEdit = (p: BackendProduct) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: (Number(p.priceInCents) / 100).toFixed(2),
      category: p.category as Category,
      stock: String(p.stock),
      image: p.imageUrl,
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const totalChunks = Math.ceil(bytes.length / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = bytes.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await (actor as any).createBlobChunk(BigInt(i), chunk);
    }
    const url: string = await (actor as any).commitBlob(
      BigInt(totalChunks),
      file.type,
    );
    return url;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
      console.error(err);
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    setSaving(true);
    try {
      const priceInCents = BigInt(
        Math.round(Number.parseFloat(form.price) * 100),
      );
      const stock = BigInt(Number.parseInt(form.stock) || 0);

      if (editProduct) {
        await (actor as any).updateProduct({
          id: editProduct.id,
          name: form.name,
          description: form.description,
          priceInCents,
          category: form.category,
          imageUrl: form.image,
          stock,
        });
        setEditProduct(null);
        toast.success("Product updated");
      } else {
        await (actor as any).addProduct(
          form.name,
          form.description,
          priceInCents,
          form.category,
          form.image,
          stock,
        );
        setIsAddOpen(false);
        toast.success("Product added");
      }
      await loadProducts();
    } catch (err) {
      toast.error("Failed to save product");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId === null || !actor) return;
    try {
      await (actor as any).deleteProduct(deleteId);
      setDeleteId(null);
      await loadProducts();
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (!actor) return;
    setBulkDeleting(true);
    try {
      for (const id of selectedIds) {
        await (actor as any).deleteProduct(id);
      }
      setSelectedIds(new Set());
      setBulkDeleteOpen(false);
      await loadProducts();
      toast.success(`Deleted ${selectedIds.size} product(s)`);
    } catch (err) {
      toast.error("Bulk delete failed");
      console.error(err);
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelect = (id: bigint) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected =
    products.length > 0 && selectedIds.size === products.length;
  const someSelected = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const ImageUploadField = () => (
    <div>
      <Label>Product Image</Label>
      <div className="mt-1 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed h-20 flex-col"
          data-ocid="admin.product.upload_button"
          onClick={() => fileInputRef.current?.click()}
          disabled={imageUploading}
        >
          {imageUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Click to upload image from device
              </span>
            </>
          )}
        </Button>
        {form.image && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-secondary">
            <img
              src={form.image}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 h-6 px-2 text-xs"
              onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
            >
              Remove
            </Button>
          </div>
        )}
        {!form.image && (
          <div className="flex items-center justify-center w-full h-20 rounded-lg border-2 border-dashed bg-secondary/40 text-muted-foreground">
            <ImagePlus className="h-8 w-8 opacity-30" />
          </div>
        )}
      </div>
    </div>
  );

  const ProductFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Product Name *</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1"
            data-ocid="admin.product.input"
          />
        </div>
        <div>
          <Label>Price (USD) *</Label>
          <Input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label>Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => setForm({ ...form, category: v as Category })}
          >
            <SelectTrigger className="mt-1" data-ocid="admin.product.select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1"
            rows={3}
            data-ocid="admin.product.textarea"
          />
        </div>
        <div className="col-span-2">
          <ImageUploadField />
        </div>
      </div>
    </div>
  );

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            Management
          </p>
          <h1 className="font-display text-3xl font-semibold">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: Package,
            label: "Products",
            value: products.length,
            color: "text-primary",
          },
          {
            icon: ShoppingBag,
            label: "Orders",
            value: MOCK_ORDERS.length,
            color: "text-amber-600",
          },
          {
            icon: TrendingUp,
            label: "Revenue",
            value: format(totalRevenue),
            color: "text-emerald-600",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold font-display">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products" data-ocid="admin.products.tab">
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="admin.orders.tab">
            Orders
          </TabsTrigger>
          <TabsTrigger value="settings" data-ocid="admin.settings.tab">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4 gap-3">
            {someSelected && (
              <Button
                variant="destructive"
                onClick={() => setBulkDeleteOpen(true)}
                data-ocid="admin.product.bulk_delete_button"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedIds.size})
              </Button>
            )}
            <div className="ml-auto">
              <Button
                onClick={openAdd}
                data-ocid="admin.product.add_button"
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>

          <Card>
            {loading ? (
              <div
                className="flex items-center justify-center py-16"
                data-ocid="admin.product.loading_state"
              >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
                data-ocid="admin.product.empty_state"
              >
                <Package className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">
                  No products yet. Add your first product.
                </p>
              </div>
            ) : (
              <Table data-ocid="admin.product.table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleSelectAll}
                        data-ocid="admin.product.select_all.checkbox"
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, idx) => (
                    <TableRow
                      key={String(product.id)}
                      data-ocid={`admin.product.row.${idx + 1}`}
                      data-selected={selectedIds.has(product.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                          data-ocid={`admin.product.checkbox.${idx + 1}`}
                          aria-label={`Select ${product.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-secondary"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium text-sm">
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {format(Number(product.priceInCents) / 100)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            Number(product.stock) <= 5
                              ? "text-destructive font-medium"
                              : ""
                          }
                        >
                          {String(product.stock)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            data-ocid={`admin.product.edit_button.${idx + 1}`}
                            onClick={() => openEdit(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-ocid={`admin.product.delete_button.${idx + 1}`}
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteId(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ORDERS.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      {order.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customer}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {order.date}
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {format(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "Shipped"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="max-w-lg">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-display">
                  Store Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-1">
                    Display Currency
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Prices are stored in USD and converted for display. Changes
                    apply instantly across the entire store.
                  </p>
                  <RadioGroup
                    value={currency}
                    onValueChange={(v) => {
                      setCurrency(v as Currency);
                      toast.success(
                        `Currency changed to ${v === "INR" ? "INR (₹)" : "USD ($)"}`,
                      );
                    }}
                    data-ocid="admin.currency.select"
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                      <RadioGroupItem
                        value="INR"
                        id="currency-inr"
                        data-ocid="admin.currency.radio"
                      />
                      <Label
                        htmlFor="currency-inr"
                        className="cursor-pointer flex-1"
                      >
                        <span className="font-medium">
                          INR (₹) — Indian Rupee
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Display prices in Indian Rupees
                        </p>
                      </Label>
                      <span className="text-lg font-semibold text-muted-foreground">
                        ₹
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                      <RadioGroupItem
                        value="USD"
                        id="currency-usd"
                        data-ocid="admin.currency.radio"
                      />
                      <Label
                        htmlFor="currency-usd"
                        className="cursor-pointer flex-1"
                      >
                        <span className="font-medium">USD ($) — US Dollar</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Display prices in US Dollars
                        </p>
                      </Label>
                      <span className="text-lg font-semibold text-muted-foreground">
                        $
                      </span>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    ℹ️ How currency works
                  </p>
                  <p>
                    All product prices are entered and stored in{" "}
                    <strong>USD</strong>. When INR is selected, prices are
                    converted using an approximate exchange rate (1 USD ≈ ₹83).
                    The setting is saved in your browser and applies to all
                    pages including cart and checkout.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent data-ocid="admin.product.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Product</DialogTitle>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || imageUploading}
              data-ocid="admin.product.save_button"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent data-ocid="admin.product.edit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Product</DialogTitle>
          </DialogHeader>
          <ProductFormFields />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditProduct(null)}
              data-ocid="admin.product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || imageUploading}
              data-ocid="admin.product.save_button"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="admin.product.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin.product.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-ocid="admin.product.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirm */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent data-ocid="admin.product.bulk_delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.size} product
              {selectedIds.size !== 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all selected products. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.product.cancel_button"
              disabled={bulkDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              data-ocid="admin.product.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkDeleting}
            >
              {bulkDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedIds.size}`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
