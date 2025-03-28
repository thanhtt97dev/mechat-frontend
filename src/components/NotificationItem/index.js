import clsx from "clsx";
import styles from "./NotificationItem.module.scss"
import { Avatar } from "antd";
import moment from 'moment';
import 'moment/locale/vi';
import { useNavigate } from "react-router-dom";
import { GetNotificationContent, GetNotificationLink } from "../Notification/Notification.service";

function NotificationItem({ notification }) {

    const navigate = useNavigate()

    return (
        <div className={clsx(styles['container'])}
            onClick={() => navigate(`${GetNotificationLink(notification.type, notification.requesterId)}`)}
        >
            <div className={clsx(styles['image'])}>
                <Avatar src={notification.image} size="large" />
            </div>
            <div className={clsx(styles['info'])}>
                <div className={clsx(styles['content'])}>
                    <p>
                        <b className={notification.isReaded ? clsx(styles['content_requesterName__isReaded']) : ''}>
                            {notification.requesterName}
                        </b>
                        <span> {GetNotificationContent(notification.type)}</span>
                    </p>
                </div>
                <div className={clsx(styles['time'])}>
                    <p className={notification.isReaded ? clsx(styles["time_Read"]) : ''}>
                        {moment(notification.createdDate).fromNow()}
                    </p>
                </div>
            </div>
            <div className={clsx(styles['isReaded'])}>
                {!notification.isReaded ?
                    <span className={clsx(styles['circle'])}></span>
                    :
                    <></>
                }
            </div>
        </div>
    );
}

export default NotificationItem;