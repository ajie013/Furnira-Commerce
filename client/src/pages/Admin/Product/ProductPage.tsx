import { useState, useMemo, useCallback } from 'react';
import { deleteProductApi, getAllProductsApi } from '@/api/productApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Loader, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/types/product';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import formatCurrency from '@/utils/currencyConverter';
import { themeMaterial } from 'ag-grid-community';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import toast from 'react-hot-toast';

type GridProduct = {
    productId: string;
    name: string;
    category: string;
    isArchive: boolean;
    price: number;
    stock: number;
    image: string | null;
    categoryId: string;
};

const ProductPage = () => {
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { isLoading, data: productList, refetch, error } = useQuery({
        queryKey: ['product-list'],
        queryFn: getAllProductsApi,
        select: (data) =>
            data.map((item: Product) => ({
                productId: item.productId,
                name: item.name,
                categoryId: item.categoryId,
                isArchive: item.isArchive,
                stock: item.stock,
                category: item.category,
                price: item.price,
                image: item.image || null,
            })),
    });

    const deleteProductMutation = useMutation({
        mutationFn: (productId: string) => deleteProductApi(productId),
        onSuccess: () => {
            toast.success('Product deleted successfully.');
            refetch();
        },
        onError: (error : any) => {
            toast.error(error.response.data.message);
        },
    });

    const handleUpdate = (productId: string) => {
        setIsUpdateModalOpen(true);
        setSelectedProduct(productId);
    };

    const handleAddProduct = () => {
        setIsAddModalOpen(true);
        setSelectedProduct(null);
    };

    const handleDelete = (productId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;
        deleteProductMutation.mutate(productId);
    };

    const CustomButtonComponent = useCallback(
        ({ productId }: { productId: string }) => {
            const handleUpdateClick = () => handleUpdate(productId);
            const handleDeleteClick = () => handleDelete(productId);

            return (
                <>
                    <Button
                        className="bg-white border shadow border-black/45 p-2 focus:outline-none"
                        onClick={handleUpdateClick}
                    >
                        <Pencil className="text-blue-500 w-4 h-4" />
                    </Button>
                    <Button
                        className="bg-white border shadow border-black/45 p-2 focus:outline-none"
                        onClick={handleDeleteClick}
                    >
                        <Trash2 className="text-red-500 w-4 h-4" />
                    </Button>
                </>
            );
        },
        [handleUpdate, handleDelete]
    );

    const headerColStyle = {
        color: 'black',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        fontSize: '14px',
        textAlign: 'center',
        padding: '10px',
        verticalAlign: 'middle',
    };

    const colDefs = useMemo<ColDef<GridProduct>[]>(() => [
        { field: 'productId', headerName: 'ID', hide: true },
        { field: 'isArchive', headerName: 'Archive', hide: true },
        { field: 'name', headerName: 'Name', flex: 2, headerStyle: headerColStyle },
        { field: 'category', headerName: 'Category', headerStyle: headerColStyle },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1,
            valueFormatter: (params) => formatCurrency(params.value),
            headerStyle: headerColStyle,
        },
        { field: 'stock', headerName: 'Stock', headerStyle: headerColStyle },
        {
            field: 'image',
            headerName: 'Image',
            flex: 2,
            headerStyle: headerColStyle,
            cellRenderer: (params: any) =>
                params.value ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            padding: '4px',
                        }}
                        className="ag-cell-content"
                    >
                        <img
                            src={params.value}
                            alt="product"
                            style={{
                                height: '30px',
                                width: 'auto',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                ) : (
                    'No Image'
                ),
        },
        {
            headerName: 'Actions',
            flex: 2,
            headerStyle: headerColStyle,
            cellRenderer: (params: any) => (
                <CustomButtonComponent productId={params.data.productId} />
            ),
        },
    ], []);

    if (isLoading) {
        return <Loader className="animate-spin size-10" />;
    }

        
    if (error) {
        return <div className="text-red-500 p-4 rounded">An error occurred while loading products. Please try again later.</div>;
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Button className="mb-2" onClick={handleAddProduct}>
                <Plus /> Add Product
            </Button>

            <div style={{ height: 400, width: '100%' }}>
                <AgGridReact<GridProduct>
                    theme={themeMaterial}
                    rowData={productList}
                    columnDefs={colDefs}
                    rowHeight={40}
                    animateRows={true}
                    colResizeDefault="shift"
                    pagination={true}
                    paginationPageSizeSelector={[5, 10, 50, 100]}
                    paginationPageSize={5}
                    cellSelection={false}
                    suppressCellFocus={true}
                    headerHeight={50}
                    domLayout="autoHeight"
                    defaultColDef={{
                        flex: 1,
                        sortable: true,
                        autoHeight: true,
                        wrapText: true,
                        resizable: true,
                        cellStyle: {
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                />
            </div>

            <AddProduct
                refetch={refetch}
                open={isAddModalOpen}
                onOpenChange={(isOpen) => setIsAddModalOpen(isOpen)}
            />
            <UpdateProduct
                refetch={refetch}
                open={isUpdateModalOpen}
                productId={selectedProduct || null}
                onOpenChange={(isOpen) => setIsUpdateModalOpen(isOpen)}
            />
        </div>
    );
};

export default ProductPage;
