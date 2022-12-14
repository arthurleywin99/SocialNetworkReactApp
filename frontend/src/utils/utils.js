import moment from 'moment';
import Moment from 'react-moment';

export const regexUsername = (username) => {
  const regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{6,29}$/;
  return regex.test(username);
};

export const calculateTime = (createdAt) => {
  const today = moment(Date.now());
  const postDate = moment(createdAt);
  const diffInHours = today.diff(postDate, 'hours');

  if (diffInHours < 24) {
    return (
      <>
        Hôm nay <Moment format='hh:mm A'>{createdAt}</Moment>
      </>
    );
  } else if (diffInHours > 24 && diffInHours < 36) {
    return (
      <>
        Hôm qua <Moment format='hh:mm A'>{createdAt}</Moment>
      </>
    );
  }
  return <Moment format='DD/MM/yyyy hh:mm A'>{createdAt}</Moment>;
};

export const newMsgSound = (senderName) => {
  const sound = new Audio('/light.mp3');

  sound && sound.play();

  if (senderName) {
    document.title = `New message from ${senderName}`;

    if (document.visibilityState === 'visible') {
      setTimeout(() => {
        document.title = 'Messages';
      }, 5000);
    }
  }
};

export const ReportExampleList = [
  {
    key: 1,
    value: 'Ảnh khoả thân',
  },
  {
    key: 2,
    value: 'Bạo lực',
  },
  {
    key: 3,
    value: 'Spam',
  },
  {
    key: 4,
    value: 'Bán hàng trái phép',
  },
  {
    key: 5,
    value: 'Quấy rối',
  },
  {
    key: 6,
    value: 'Khủng bố',
  },
  {
    key: 7,
    value: 'Ngôn từ gây thù ghét',
  },
  {
    key: 8,
    value: 'Thông tin sai sự thật',
  },
  {
    key: 9,
    value: 'Tự tử hoặc gây thương tích',
  },
];
