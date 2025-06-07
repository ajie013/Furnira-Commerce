import React, { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { getAllOrdersApi, updateOrderStatusApi } from '@/api/orderApi';
import type { ColDef } from 'ag-grid-community';
import toast from 'react-hot-toast';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import formatCurrency from '@/utils/currencyConverter';

type Order = {
  orderId: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

const OrderPage = () => {
  const { data: orderList, isLoading, refetch } = useQuery({
    queryKey: ['order-list'],
    queryFn: getAllOrdersApi,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: string }) =>
      updateOrderStatusApi(orderId, newStatus),
    onSuccess: () => {
      toast.success('Order status updated');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const handleStatusChange = (orderId: string, status: string) => {
    statusMutation.mutate({ orderId, newStatus: status });
  };

  const colDefs = useMemo<ColDef<Order>[]>(() => [
    { field: 'orderId', headerName: 'Order ID' },
    { field: 'userId', headerName: 'User ID', hide: true },
    { field: 'totalAmount', headerName: 'Total Amount', valueFormatter: ({ value }) => formatCurrency(value) },
    { field: 'status', headerName: 'Status' },
    { field: 'createdAt', headerName: 'Date', valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          {['Pending', 'Shipped', 'Delivered'].map((status) => (
            <Button
              key={status}
              className="text-xs px-2 py-1"
              disabled={params.data.status === status}
              onClick={() => handleStatusChange(params.data.orderId, status)}
            >
              {status}
            </Button>
          ))}
        </div>
      ),
    },
  ], []);

  if (isLoading) {
    return <Loader className="animate-spin m-4" />;
  }

  return (
    <div style={{ height: 500, width: '100%' }} className="ag-theme-alpine">
      <AgGridReact<Order>
        rowData={orderList}
        columnDefs={colDefs}
        pagination={true}
       rowHeight={40}
                    animateRows={true}
                    colResizeDefault="shift"
                  
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
  );
};

export default OrderPage;
