import { getCategoryByIdApi, updateCategoryApi } from "@/api/categoryApi";
import { Button } from "@/components/ui/button";
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
import { Loader } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

interface UpdateCategoryProps {
    categoryId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch: () => void;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({
    refetch,
    categoryId,
    open,
    onOpenChange,
}) => {
    const [previousCategoryName, setPreviousCategoryName] = useState<string | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);

    const { data: category, isLoading: isLoadingCategory } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategoryByIdApi(categoryId!),
        enabled: open && !!categoryId, 
    });

    useEffect(() => {
        if (category) {
            setCategoryName(category.name);
            setPreviousCategoryName(category.name);
        }
    }, [category]);

    const handleCategoryNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    };

    const updateCategoryMutation = useMutation({
        mutationFn: () => updateCategoryApi(categoryId!, categoryName!),
        onSuccess: () => {
            toast.success("Category updated!");
            onOpenChange(false);
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred");
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!categoryName) {
            toast.error("Please fill out all required fields.");
            return;
        }

        if (categoryName === previousCategoryName) {
            toast.error("No changes made to the category name.");
            return;
        }

        updateCategoryMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Category</DialogTitle>
                    <DialogDescription>
                      
                        {!category || isLoadingCategory ? (
                            <div className="flex justify-center py-10">
                                <Loader className="animate-spin size-10" />
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Category Name Input */}
                                <div>
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Furniture"
                                        value={categoryName ?? ""}
                                        onChange={handleCategoryNameChange}
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    className="w-full mt-4 p-2"
                                    type="submit"
                                    disabled={updateCategoryMutation.isPending}
                                >
                                    {updateCategoryMutation.isPending ? (
                                        <Loader className="animate-spin w-4 h-4" />
                                    ) : (
                                        "Update Category"
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

export default UpdateCategory;
