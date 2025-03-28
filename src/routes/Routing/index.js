import { useCallback, useState, useEffect, useContext } from "react";
import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import routes from "../routes";
import NotFound from "~/pages/NotFound";
import { useAuthUser, useSignIn } from "react-auth-kit";
import { getAccessToken, getUserId, removeAllDataInCookie } from "~/utils/cookie.util";
import { getUserInfo } from "~/api/Auth";
import { LoadingContext } from "~/contexts/UI/LoadingContext";
import { APPLICATION } from "~/constants/Appication.constant";
import { ENPOINT } from "~/constants/Enpoint.constant";

function Routing() {

    const loading = useContext(LoadingContext)
    const signInAuth = useSignIn()
    const auth = useAuthUser()
    const user = auth()

    const [routesCanVisit, setRoutesCanVisit] = useState([])

    const getRoutesCanVisit = useCallback(() => {
        setRoutesCanVisit([])
        routes.forEach((route) => {
            if (route.roles === undefined) {
                setRoutesCanVisit((prev) => [...prev, route])
            } else {
                if (user === undefined)
                    return;
                if (user?.roleId === undefined)
                    return;
                if (route.roles.includes(user.roleId)) {
                    setRoutesCanVisit((prev) => [...prev, route])
                }
            }
        })
    }, [user]);

    useEffect(() => {

        loading(true)
        var userId = getUserId()
        var accessToken = getAccessToken()
        if (userId === null || userId === undefined ||
            accessToken === null || accessToken === undefined) {
            loading(false)
            return;
        }

        getUserInfo(userId)
            .then((response) => {
                signInAuth({
                    token: 'not have meaning',
                    expiresIn: 10000,
                    tokenType: "Bearer",
                    authState: {
                        userId: response.value.userId,
                        username: response.value.userName,
                        fullname: response.value.fullname,
                        roleId: response.value.roleId,
                        avatar: response.value.avatar
                    },
                    refreshToken: 'not have meaning',
                    refreshTokenExpireIn: 10000,
                })
            })
            .catch(() => {
                removeAllDataInCookie();
            })
            .finally(() => {
                loading(false, 1000)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        getRoutesCanVisit()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    window.cookieStore.addEventListener("change", (event) => {
        var currentUrl = window.location.href
        if (currentUrl.includes(ENPOINT.SIGN_IN))
            return;

        event.deleted.forEach((cookie) => {
            if (cookie.name === APPLICATION.ACCESS_TOKEN ||
                cookie.name === APPLICATION.USER_ID
            ) {
                window.location.reload();
            }
        });
    });

    return (
        <>
            <Router>
                <Routes>
                    {routesCanVisit.map((route, index) => {
                        return (
                            <Route key={index} path={route.path} element={route.layout ? route.layout : <Outlet />}>
                                <Route key={route.path} path="" element={route.component} />
                            </Route>
                        )
                    })}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}

export default Routing;