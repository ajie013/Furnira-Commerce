import axiosInstance from "@/lib/axios";

const getAllCategoriesApi = async () =>{
    try {
        const categoryList = await axiosInstance.get('/category/category-list')

        return categoryList.data;
    } catch (error) {
        console.log(error)
    }
}

export { getAllCategoriesApi }