import React, {FC, useContext} from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import LoginForm from "./pages/login/LoginForm";
import {AuthContext} from "../index";
import {observer} from "mobx-react-lite";
import Main from "./pages/main/Main";
import RegisterForm from "./pages/register/RegisterForm";
import Profile from './pages/profile/Profile';
import AddProperty from "./pages/addProperty/AddProperty";
import PropertyPage from "./pages/propertyPage/PropertyPage";
import AuthCallback from "./pages/authCallback/AuthCallback";

const AppRouter: FC = () => {
    const {store} = useContext(AuthContext)

    if (store.isLoading) {
        return (
          <div>Загрузка...</div>
        );
    }


    if (store.isAuth) {
        return (
            <Routes>
                <Route path="/main" element={<Main/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/add-property" element={<AddProperty/>}/>
                <Route path="/properties/:id" element={<PropertyPage/>} />
                <Route path="*" element={<Navigate to={"/main"} />} />
            </Routes>
        )
    }
    else {
        return (
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm/>}/>
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<Navigate to={"/login"} />} />
            </Routes>
        )
    }
};

export default observer(AppRouter);