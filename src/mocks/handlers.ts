import userSendFriendHandler from '@/mocks/userSendFriendHandler';
import userThemeHandler from '@/mocks/userThemeHandler';
import userProfileHandler from '@/mocks/userProfileHandler';
import userBlockHandler from '@/mocks/userBlockHandler';
import userHouseStatusHandler from '@/mocks/userHouseStatusHandler';
import userBookmarkHandler from '@/mocks/userBookmarkHandler';
import userFriendHandler from '@/mocks/userFriendHandler';
import userAlarmSettingHandler from '@/mocks/userAlarmSettingHandler';
import userActivityHandler from '@/mocks/userActivityHandler';
import userHandler from '@/mocks/userHandler';
import userAuthHandler from '@/mocks/userAuthHandler';

const handlers = [
  ...userSendFriendHandler,
  ...userThemeHandler,
  ...userProfileHandler,
  ...userBlockHandler,
  ...userHouseStatusHandler,
  ...userBookmarkHandler,
  ...userFriendHandler,
  ...userAlarmSettingHandler,
  ...userActivityHandler,
  ...userAuthHandler,
  ...userHandler,
];

export default handlers;
