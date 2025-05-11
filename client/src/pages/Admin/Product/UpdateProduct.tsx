import { getAllCategoriesApi } from "@/api/categoryApi";
import { getProductByIdApi, updateProductApi } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/category";
import type { UpdateProductFormData } from "@/types/product";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import toast from "react-hot-toast";

interface UpdateProductProps {
    productId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch: () => void;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({
    refetch,
    productId,
    open,
    onOpenChange,
}) => {
    const [formData, setFormData] = useState<UpdateProductFormData>({
        name: "",
        price: null,
        stock: null,
        categoryId: null,
    });

    const imageRef = useRef<HTMLInputElement | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productImage, setProductImage] = useState<string | null>(null);

    const { data: categoryList, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["category-list"],
        queryFn: getAllCategoriesApi,
        enabled: open,
    });


    const { data: product } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getProductByIdApi(productId!),
        enabled: open && !!productId,
    });

    console.log(product);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
            });

            setProductImage(product.image || null);
        }
    }, [product]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "price" || id === "stock" ? Number(value) : value,
        }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setProductImage(URL.createObjectURL(file));
        }
    };

    const uploadImage = () => {
        imageRef.current?.click();
    };

    const updateProductMutation = useMutation({
        mutationFn: () => updateProductApi(productId!, formData, imageFile),
        onSuccess: () => {
            toast.success("Product updated!");
            onOpenChange(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update product");
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !formData.name ||
            formData.price === null ||
            formData.stock === null ||
            !formData.categoryId
        ) {
            toast.error("Please fill out all required fields.");
            return;
        }

        if (
            product &&
            JSON.stringify(formData) === JSON.stringify({
                name: product.name,
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
            }) &&
            !imageFile
        ) {
            return toast.error("No changes have been made");
        }

        updateProductMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Product</DialogTitle>
                    <DialogDescription>
                        {!product || isLoadingCategories ? (
                            <div className="flex justify-center py-10">
                                <Loader className="animate-spin size-10" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload */}
                                <div className="flex flex-col items-center gap-2">
                                    <Input
                                        ref={imageRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                    <div className="relative h-24 w-24 border rounded bg-black flex items-center justify-center overflow-hidden">
                                        {productImage && (
                                            <img
                                                src={productImage}
                                                alt="Product preview"
                                                className="object-cover h-full w-full"
                                            />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" onClick={uploadImage}>
                                            Upload Image
                                        </Button>
                                    </div>
                                </div>

                                {/* Product Name */}
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Elegant Wooden Table"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="e.g., 49.99"
                                        value={formData.price ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        placeholder="e.g., 100"
                                        value={formData.stock ?? ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <Label htmlFor="categoryId">Category</Label>
                                    <select
                                        id="categoryId"
                                        value={formData.categoryId ?? ""}
                                        onChange={handleChange}
                                        className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1"
                                    >
                                        <option value="" disabled>
                                            Please select a category
                                        </option>
                                        {categoryList?.map((item: Category) => (
                                            <option key={item.categoryId} value={item.categoryId}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    className="w-full mt-4 p-2"
                                    type="submit"
                                    disabled={updateProductMutation.isPending}
                                >
                                    {updateProductMutation.isPending ? (
                                        <Loader className="animate-spin w-4 h-4" />
                                    ) : (
                                        "Update Product"
                                    )}
                                </Button>
                            </form>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProduct;
