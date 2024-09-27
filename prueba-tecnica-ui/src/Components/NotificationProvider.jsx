import { notificationService } from '../Services'; 
import PropTypes from 'prop-types'; 

const NotificationProvider = ({ children }) => {
  const { ToastNotification, notify } = notificationService();

  return (
    <>
      {children(notify)}
      <ToastNotification />
    </>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.func.isRequired, 
};

export default NotificationProvider;