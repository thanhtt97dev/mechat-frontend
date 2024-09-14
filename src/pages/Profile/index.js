import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useLayoutEffect, useState } from "react";

import styles from "./Profile.module.scss"
import HeaderProfile from "~/components/Profile/HeaderProfile";
import { getUserPublicInfo } from "~/api/User";
import { LoadingContext } from "~/contexts/LoadingContext";
import { NotificationContext } from "~/contexts/NotificationContext";
import { RESULT_CODES } from "~/constants/ResultCode.constant.ts";
import { useAuthUser } from "react-auth-kit";
import { FRIEND_STATUS } from "~/constants/FriendStatus.constant.ts";
import { ENPOINT } from "~/constants/Enpoint.constant.ts";


function Profile() {

    let { id } = useParams()

    const auth = useAuthUser()
    const user = auth()
    const navigate = useNavigate();
    const loading = useContext(LoadingContext)
    const notification = useContext(NotificationContext)

    const [userInfo, setUserInfo] = useState({})

    useLayoutEffect(() => {
        loading(true)
        getUserPublicInfo(id, user?.userId)
            .then((response) => {
                if (response.code === RESULT_CODES.NOT_FOUND) {
                    navigate(ENPOINT.NOT_FOUND)
                    return;
                }
                var data = response.value
                if (data.relationshipStatus === FRIEND_STATUS.BLOCK) {
                    navigate(ENPOINT.NOT_FOUND)
                    return;
                }
                setUserInfo({
                    ...userInfo,
                    userId: data.id,
                    email: data.email,
                    avatar: data.avatar,
                    fullname: data.fullname,
                    username: data.username,
                    relationshipStatus: data.relationshipStatus
                })
            })
            .catch(() => {

            })
            .finally(() => {
                loading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={clsx(styles['container'])}>
            <HeaderProfile user={userInfo} />
        </div>
    );
}

export default Profile;