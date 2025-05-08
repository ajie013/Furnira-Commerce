import { useState, useMemo, useEffect } from 'react';
import { deleteProductApi, getAllProducts } from '@/api/productApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Loader, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Product } from '@/types/product';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Category } from '@/types/category';
import formatCurrency from '@/utils/currencyConverter';
import { themeBalham } from 'ag-grid-community';
import  AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import toast from 'react-hot-toast';


type GridProduct = {
  productId: string;
  name: string;
  Category: Category;
  price: number;
  stock: number;
  image?: string;
};

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [modal, setModal] = useState({
    
    isOpenUpdateModal: false,
    isOpenAddModal: false
  });

  const { isLoading, data: productList, refetch} = useQuery({
    queryKey: ['product-list'],
    queryFn: getAllProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => deleteProductApi(productId),
    onSuccess: () => {
      toast.success("Product deleted successfully.");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });

  const handleUpdate = (productId: string) => {
   
    setModal(prev => ({...prev, isOpenUpdateModal: true}))
    setSelectedProduct(productId)
  };

  const handleAddProduct = () => {
    setModal(prev => ({...prev, isOpenAddModal: true}))
    setSelectedProduct(null)
  };

  const handleDelete = (productId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
  
    deleteProductMutation.mutate(productId);
  };

  const CustomButtonComponent = (props: { productId: string }) => {
    const { productId } = props;
  
    return (
      <>
        <Button
        className="bg-white border shadow border-black/45 p-2 focus:outline-none"
        onClick={() => handleUpdate(productId)}
        >
        <Pencil className="text-blue-500 w-4 h-4" />
        </Button>
        <Button
          className="bg-white border shadow border-black/45 p-2 focus:outline-none"
          onClick={() => handleDelete(productId)}
        >
        <Trash2 className="text-red-500 w-4 h-4" />
      </Button>

      </>
    
    );
  };
  
  const colDefs = useMemo<ColDef<GridProduct>[]>(() => [
    { field: 'productId', headerName: 'ID', hide: true, flex: 1 },
    { field: 'name', headerName: 'Product Name', flex: 1 },
    { field: 'Category', headerName: 'Category', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'stock', headerName: 'Stock', flex: 1 },
    {
      field: 'image',
      headerName: 'Image',
      cellRenderer: (params: any) =>
        params.value ? (
          <img
          src={params.value}
          alt="product"
          style={{ width: 36, height: 36, objectFit: 'contain' }}
        />
        ) : (
          'No Image'
        ),
        flex: 2
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <CustomButtonComponent productId={params.data.productId} />
      ),
      flex: 2
    },
    
  ], []);

  useEffect(() => {
    if (productList) {
      const updatedProductList: GridProduct[] = productList.map((item: Product) => ({
        productId: item.productId,
        name: item.name,
        stock: item.stock,
        Category: item.Category.name ?? 'Unknown',
        price: formatCurrency(item.price),
        image: item.image || null, 
      }));

      setProducts(updatedProductList);
    }
  }, [productList]);

  if(isLoading){
    return(
      <>
        <Loader className='animate-spin size-10'></Loader>
      </>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Button className='mb-2' onClick={handleAddProduct}><Plus/>Add Product</Button>
      
        <div  style={{ height: 400, width: '100%' }}>
          <AgGridReact<GridProduct>
            theme={themeBalham} 
            rowData={products}
            columnDefs={colDefs}
            rowHeight={40}
            pagination={true}
            paginationPageSizeSelector={[5,10,50,100]}
            paginationPageSize={5}
            cellSelection={false}
          />
        </div>
     
        <AddProduct refetch={refetch} open={modal.isOpenAddModal} onOpenChange={(isOpen) => setModal((prev) => ({...prev, isOpenAddModal: isOpen}))}/>
        <UpdateProduct refetch={refetch} open={modal.isOpenUpdateModal} productId={selectedProduct || null} onOpenChange={(isOpen) => setModal((prev) => ({...prev, isOpenUpdateModal: isOpen}))}/>
    </div>
  );
  
};


export default ProductPage;
