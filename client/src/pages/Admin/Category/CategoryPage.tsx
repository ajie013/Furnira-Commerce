import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Loader, Pencil, Plus } from 'lucide-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Category } from '@/types/category';
import { themeMaterial } from 'ag-grid-community';
import { getAllCategoriesApi } from '@/api/categoryApi';
import AddCategory from './AddCategory';
import UpdateCategory from './UpdateCategory';

type GridCategory = {
  categoryId: string;
  name: string;
};

const CategoryPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  const { isLoading, data: categoryList, refetch, error } = useQuery({
    queryKey: ['category-list'],
    queryFn: getAllCategoriesApi,
    select: (data) =>
      data.map((item: Category) => ({
        categoryId: item.categoryId,
        name: item.name,
      })),
  });

  const handleUpdateCategory = (categoryId: string) => {
    setIsUpdateModalOpen(true);
    setSelectedCategory(categoryId);
  };

  const handleAddCategory = () => {
    setIsAddModalOpen(true);
    setSelectedCategory(null);
  };

  const CustomButtonComponent = ({ categoryId }: { categoryId: string }) => {
    return (
      <Button
        className="bg-white border shadow border-black/45 p-2 focus:outline-none"
        onClick={() => handleUpdateCategory(categoryId)}
      >
        <Pencil className="text-blue-500 w-4 h-4" />
      </Button>
    );
  };

  const columnDefinitions = useMemo<ColDef<GridCategory>[]>(() => [
    { field: 'categoryId', headerName: 'ID', hide: true, flex: 1 },
    { field: 'name', headerName: 'Category Name', flex: 2 },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <CustomButtonComponent categoryId={params.data.categoryId} />
      ),
      flex: 2,
    },
  ], []);

  if (isLoading) {
    return <Loader className="animate-spin size-10" />;
  }

  if (error) {
    return <div className="text-red-500 p-4 rounded">An error occurred while loading categories. Please try again later.</div>;
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Button className="mb-2" onClick={handleAddCategory}>
        <Plus /> Add New Category
      </Button>

      <div style={{ height: 400, width: '100%' }}>
        <AgGridReact<GridCategory>
          theme={themeMaterial}
          rowData={categoryList}
          columnDefs={columnDefinitions}
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
          sideBar={true}
        />
      </div>

      <AddCategory
        refetch={refetch}
        open={isAddModalOpen}
        onOpenChange={(isOpen) => setIsAddModalOpen(isOpen)}
      />
      <UpdateCategory
        refetch={refetch}
        open={isUpdateModalOpen}
        categoryId={selectedCategory || null}
        onOpenChange={(isOpen) => setIsUpdateModalOpen(isOpen)}
      />
    </div>
  );
};

export default CategoryPage;
