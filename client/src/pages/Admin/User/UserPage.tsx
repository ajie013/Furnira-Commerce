import { getAllUsersApi } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { AgGridReact } from "ag-grid-react";
import { themeMaterial } from "ag-grid-community";
import { Plus } from "lucide-react";
import { Grid, Loader, Pencil, Trash2 } from "lucide-react";
import type { ColDef } from "node_modules/ag-grid-community/dist/types/src/entities/colDef";
import { useCallback, useMemo, useState } from "react";

interface GridUser{
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isArchive: boolean;
    role: string;
}

const UserPage = () => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { data: userList, isLoading, refetch, error } = useQuery({
        queryKey: ['user-list'],
        queryFn: getAllUsersApi,
    
    });

    const handleUpdate = (userId: string) => {
        setIsUpdateModalOpen(true);
        // setSelectedProduct(productId);
    };

    const handleAddProduct = () => {
        setIsAddModalOpen(true);
        //setSelectedProduct(null);
    };

    const handleDelete = (userId: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;
       // deleteProductMutation.mutate(productId);
    };

     const CustomButtonComponent = useCallback(
        ({ userId, isArchive }: { userId: string, isArchive: boolean}) => {
            const handleUpdateClick = () => handleUpdate(userId);
            const handleDeleteClick = () => handleDelete(userId);

            return (
                <>
                    <Button
                        className="bg-white border shadow border-black/45 p-2 focus:outline-none"
                        onClick={handleUpdateClick}
                    >
                        <Pencil className="text-blue-500 w-4 h-4" />
                    </Button>

                    {!isArchive &&  

                    <Button
                        className="bg-white border shadow border-black/45 p-2 focus:outline-none"
                        onClick={handleDeleteClick}
                    >
                        <Trash2 className="text-red-500 w-4 h-4" />
                    </Button>}
                  
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

    const colDefs = useMemo<ColDef<GridUser>[]>(() => [
        { field: 'userId', headerName: 'ID', hide: true },
        { field: 'username', headerName: 'Username', hide: true },
        { field: 'isArchive', headerName: 'Archive', hide: true },
        { field: 'firstName', headerName: 'First Name', flex: 1, headerStyle: headerColStyle },
         { field: 'lastName', headerName: 'Last Name', flex: 1, headerStyle: headerColStyle },
        { field: 'email', headerName: 'Email', headerStyle: headerColStyle },
        { field: 'phoneNumber', headerName: 'Phone', headerStyle: headerColStyle },
        { field: 'role', headerName: 'Role', headerStyle: headerColStyle },

        {
            headerName: 'Actions',
            flex: 2,
            headerStyle: headerColStyle,
            cellRenderer: (params: any) => (
                <CustomButtonComponent userId={params.data.userId} isArchive={params.data.isArchive} />
            ),
        },
    ], []);
    
    if (isLoading) {
        return <Loader className="animate-spin size-10" />;
    }

    if (error) {
        return <div className="text-red-500 p-4 rounded">An error occurred while loading users. Please try again later.</div>;
    }


    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Button className="mb-2" onClick={handleAddProduct}>
                <Plus /> Add New User
            </Button>

            <div style={{ height: 400, width: '100%' }}>
                <AgGridReact<GridUser>
                    theme={themeMaterial}
                    rowData={userList}
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
                    defaultColDef={{
                        flex: 1,
                        sortable: true,
                        autoHeight: true,
                      
                        resizable: true,
                        cellStyle: {
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                />
            </div>

            {/* <AddProduct
                refetch={refetch}
                open={isAddModalOpen}
                onOpenChange={(isOpen) => setIsAddModalOpen(isOpen)}
            />
            <UpdateProduct
                refetch={refetch}
                open={isUpdateModalOpen}
                productId={selectedProduct || null}
                onOpenChange={(isOpen) => setIsUpdateModalOpen(isOpen)}
            /> */}
        </div>
    )
}

export default UserPage