import React, {FC, useContext, useState} from 'react';
import LoginInput from "../../ui/input/LoginInput";
import cl from './LoginForm.module.css';
import {AuthContext} from "../../../index";
import LoginButton from "../../ui/button/loginButton/LoginButton";
import peopleImage1 from '../../../assets/images/people1.png';
import peopleImage2 from '../../../assets/images/people2.png';
import logo from '../../../assets/images/logo.png';
import {observer} from "mobx-react-lite";
import {Link} from "react-router-dom";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [authError, setAuthError] = useState<boolean>(false);
    const {store} = useContext(AuthContext);

    const handleLogin = () => {
        let hasError = false;

        if (!email) {
            setEmailError(true);
            hasError = true;
        } else {
            setEmailError(false);
        }

        if (!password) {
            setPasswordError(true);
            hasError = true;
        } else {
            setPasswordError(false);
        }

        if (!hasError) {
            store.login(email, password).then(() => {
                if (!store.isAuth) {
                    setAuthError(true)
                }
            });
        }
    };

    const handleAuth0Login = async () => {
        console.log('[auth0] click');
        try {
            const state = crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2);
            localStorage.setItem('oauth_state', state);

            const redirectUrl = `${window.location.origin}/auth/callback`;
            console.log('[auth0] redirectUrl =', redirectUrl);

            const res = await fetch(
                `/api/v1/auth/oauth2/url?provider=auth0&redirect_url=${encodeURIComponent(
                    redirectUrl
                )}&state=${encodeURIComponent(state)}`
            );

            console.log('[auth0] response status =', res.status);

            if (!res.ok) {
                console.error('[auth0] failed to get url');
                return;
            }

            const data = await res.json();
            console.log('[auth0] response json =', data);

            const authUrl = data.authUrl || data.auth_url;
            console.log('[auth0] authUrl =', authUrl);

            if (authUrl) {
                window.location.href = authUrl;
            } else {
                console.error('[auth0] authUrl is empty');
            }
        } catch (e) {
            console.error('[auth0] error', e);
        }
    };

    return (
        <div className={cl.loginPage}>
            <div className={cl.imageContainerLeft} style={{backgroundImage: `url(${peopleImage1})`}}></div>
            <div className={cl.loginWrapper}>
                <div className={cl.loginForm}>
                    <img className={cl.logo} src={logo} alt=""/>
                    <p>Войдите, чтобы продолжить</p>
                    <LoginInput
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Почта"
                        className={emailError ? cl.errorBorder : ''}
                    />
                    {authError && <div style={{color: 'red'}}>Неправильный логин или пароль</div>}
                    <LoginInput
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Пароль"
                        className={passwordError ? cl.errorBorder : ''}
                    />
                    <LoginButton onClick={handleLogin}>
                        Авторизация
                    </LoginButton>

                    <LoginButton onClick={handleAuth0Login}>
                        Войти через Auth0
                    </LoginButton>
                </div>
                <Link className={cl.link} to="/register">Создать аккаунт</Link>
            </div>
            <div className={cl.imageContainerRight} style={{backgroundImage: `url(${peopleImage2})`}}></div>
        </div>
    );
};

export default observer(LoginForm);
