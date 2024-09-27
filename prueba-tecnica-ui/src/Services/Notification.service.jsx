import { Toast } from 'react-bootstrap';
import { useState } from 'react';

const NotificationService = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const notify = (msg) => {
    setMessage(msg);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const ToastNotification = () => (
    <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );

  return { notify, ToastNotification };
};


export default NotificationService; 
