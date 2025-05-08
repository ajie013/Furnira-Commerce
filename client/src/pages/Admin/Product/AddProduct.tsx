import { getAllCategoriesApi } from "@/api/category";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, X } from "lucide-react";
import type { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { AddProductFormData } from "@/types/product";
import { createProductApi } from "@/api/productApi";

interface AddProductProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ refetch, open, onOpenChange }) => {

    const [formData, setFormData] = useState<AddProductFormData>({
        name: '',
        price: null,
        stock: null,
        categoryId: null
    });

    const imageRef = useRef<HTMLInputElement | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [productImage, setProductImage] = useState<string | null>(null);

    const { data: categoryList, isLoading: isLoadingCategories } = useQuery({
        queryKey: ["category-list"],
        queryFn: getAllCategoriesApi,
        enabled: open
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const addProductMutation = useMutation({
        mutationFn: () => createProductApi(formData, imageFile),
        onSuccess: () => {
            toast.success("Product created!");
            onOpenChange(false);
            refetch();
        },
        onError: () => {
            toast.error("Failed to create product.");
        },
    });
    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.categoryId || !formData.name || !formData.price || !formData.stock){
            return toast.error('Fill all required information');
        }
          
        addProductMutation.mutate();

        setFormData({
            name: '',
            price: null,
            stock: null,
            categoryId: null
        })
    };

    const handleDeleteImage = () => {
        setImageFile(null);
        setProductImage(null);
        if (imageRef && imageRef.current) {
            imageRef.current.value = '';
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setProductImage(URL.createObjectURL(file));
        }
    };

    const uploadImage = () => {
        if (imageRef && imageRef.current) {
            imageRef.current.click();
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Product</DialogTitle>
                        <DialogDescription>

                            {isLoadingCategories ? (
                                <Loader className="animate-spin size-10" />
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {/* Image Upload */}
                                    <div className="flex flex-col items-center justify-center gap-2 my-4">
                                        <Input
                                            ref={imageRef}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleImageChange}
                                        />
                                        <div className="relative h-24 w-24 border rounded bg-black flex items-center justify-center overflow-hidden">
                                            {productImage && (
                                                <>
                                                    <X
                                                        className="absolute top-1 right-1 text-red-500 size-5 cursor-pointer z-10"
                                                        onClick={handleDeleteImage}
                                                    />
                                                    <img
                                                        src={productImage}
                                                        alt="Product preview"
                                                        className="object-cover h-full w-full"
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <Button type="button" onClick={uploadImage}>
                                            Upload Product Image
                                        </Button>
                                    </div>
                                
                                    {/* Product Name */}
                                    <div className="mt-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Elegant Wooden Table"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                
                                    {/* Price */}
                                    <div className="mt-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            placeholder="Enter the product price (e.g., 49.99)"
                                            value={formData.price ?? ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                
                                    {/* Stock */}
                                    <div className="mt-2">
                                        <Label htmlFor="stock">Stock Quantity</Label>
                                        <Input
                                            id="stock"
                                            placeholder="Enter available stock quantity"
                                            value={formData.stock ?? ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                
                                    {/* Category */}
                                    <div className="mt-2">
                                        <Label htmlFor="categoryId">Category</Label>
                                        <select
                                            id="categoryId"
                                            onChange={handleChange}
                                            className="focus-visible:border-black flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs"
                                        >
                                            <option value="" disabled selected>
                                                Please select a product category
                                            </option>
                                            {categoryList && categoryList.map((item: Category) => (
                                                <option key={item.categoryId} value={item.categoryId}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                
                                    {/* Submit */}
                                    <Button className="w-full mt-4 p-2" disabled={addProductMutation.isPending}>
                                    {addProductMutation.isPending ? (
                                        <Loader className="animate-spin w-4 h-4" />
                                    ) : (
                                        "Add"
                                    )}
                                    </Button>
                                </form>
                            
                            )}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddProduct;
