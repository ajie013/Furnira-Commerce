import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AdminLayout from './layout/AdminLayout'
const App = () =>{
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<AdminLayout/>}>
                        
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
