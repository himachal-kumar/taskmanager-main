import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState, useEffect } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import axios from "axios"; // Keep regular axios for now

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?._id) {
        console.log("No user found in localStorage");
        return;
      }

      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/user/notifications/${user._id}`
      );
      
      if (response.data.status) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?._id) return;

      await axios.post(
        `http://localhost:5000/api/user/mark-notification-read/${user._id}`,
        { notificationId }
      );

      // Remove the notification from the local state
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center outline-none">
        <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
          <IoIosNotificationsOutline className="text-2xl" />
          {notifications.length > 0 && (
            <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
              {notifications.length}
            </span>
          )}
        </div>
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 w-screen max-w-sm">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative bg-white p-7">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center text-gray-500">No new notifications</div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <li
                        key={notification._id}
                        className="flex py-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => markAsRead(notification._id)}
                      >
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{notification.text}</p>
                          <div className="mt-1 flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              {moment(notification.createdAt).fromNow()}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {notification.createdBy?.name || 'Admin'}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NotificationPanel;
