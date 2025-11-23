import React, {FC, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {AuthContext} from '../../../index';

const AuthCallback: FC = () => {
    const {store} = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const run = async () => {
            try {
                console.log('[auth0-callback] mounted, url =', window.location.href);

                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const state = params.get('state');

                console.log('[auth0-callback] code =', code, 'state =', state);

                if (!code) {
                    setError('Отсутствует код авторизации');
                    setLoading(false);
                    return;
                }

                const storedState = localStorage.getItem('oauth_state');
                console.log('[auth0-callback] storedState =', storedState);

                if (!state || !storedState || state !== storedState) {
                    setError('Некорректный параметр state');
                    setLoading(false);
                    return;
                }

                const redirectUrl = `${window.location.origin}/auth/callback`;
                console.log('[auth0-callback] redirectUrl =', redirectUrl);

                const res = await fetch('/api/v1/auth/oauth2/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        provider: 'auth0',
                        code,
                        redirectUrl,
                        appId: 1,
                    }),
                    credentials: 'include',
                });

                console.log('[auth0-callback] login status =', res.status);

                if (!res.ok) {
                    setError('Не удалось выполнить вход через Auth0');
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                console.log('[auth0-callback] response json =', data);

                const userId = data.userId ?? data.user_id;
                const token = data.token;

                if (!userId || !token) {
                    setError('Ответ авторизации некорректен');
                    setLoading(false);
                    return;
                }

                localStorage.setItem('id', String(userId));
                localStorage.removeItem('oauth_state');

                store.setAuth(true);
                await store.loginOAuth(userId)

                try {
                    await store.checkAuth();
                } catch (e) {
                    console.log('[auth0-callback] checkAuth error', e);
                }
            } catch (e) {
                console.log('[auth0-callback] error', e);
                setError('Произошла ошибка при входе через Auth0');
                setLoading(false);
            }
        };

        run();
    }, [navigate, store]);

    if (loading && !error) {
        return <div>Завершаем авторизацию...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return null;
};

export default observer(AuthCallback);
