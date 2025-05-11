import axiosInstance from "@/lib/axios";


const getAllCategoriesApi = async () =>{
    const categoryList = await axiosInstance.get('/category/category-list')
       
    return categoryList.data
}

const getCategoryByIdApi = async (categoryId: string) =>{

    const category = await axiosInstance.get(`/category/${categoryId}`)
       
    return category.data
}

const createCategoryApi = async ( name: string) => {

    const res = await axiosInstance.post('/category', {
        name
    });
   
    return res.data;
}

const updateCategoryApi = async (categoryId: string, name: string) => {
    const res = await axiosInstance.put(`/category/${categoryId}`, {
        name
    });
   
    return res.data;
};

// const deleteCategoryApi = async (categoryId: string) =>{
//     try {
//         await axiosInstance.delete(`/category/${categoryId}`);

//     } catch (error: any) {
//         toast.error(error.response.data.message)
//     }
// }

export {getAllCategoriesApi, getCategoryByIdApi, createCategoryApi, updateCategoryApi}