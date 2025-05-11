import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { createCategoryApi } from "@/api/categoryApi";

interface AddCategoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch: () => void;
}

const AddCategory: React.FC<AddCategoryProps> = ({ refetch, open, onOpenChange }) => {
    const [newCategoryName, setNewCategoryName] = useState<string>('');

    const handleCategoryNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewCategoryName(e.target.value);
    };

    const addCategoryMutation = useMutation({
        mutationFn: () => createCategoryApi(newCategoryName),
        onSuccess: () => {
            toast.success("Category created!");
            onOpenChange(false);
            refetch();
            setNewCategoryName('');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred");
        },
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newCategoryName.trim()) {
            return toast.error('Fill all required information');
        }

        if (newCategoryName.length < 3) {
            return toast.error('Category name must be at least 3 characters long');
        }

        addCategoryMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={handleSubmit}>
                            {/* Category Name */}
                            <div className="mt-2">
                                <Label htmlFor="category-name">Category Name</Label>
                                <Input
                                    id="category-name"
                                    placeholder="e.g., Table"
                                    value={newCategoryName}
                                    onChange={handleCategoryNameChange}
                                />
                            </div>

                            {/* Submit Button */}
                            <Button 
                                className="w-full mt-4 p-2"
                                disabled={addCategoryMutation.isPending}
                            >
                                {addCategoryMutation.isPending ? (
                                    <Loader className="animate-spin w-4 h-4" />
                                ) : (
                                    "Add"
                                )}
                            </Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategory;
