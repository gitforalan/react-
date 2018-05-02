import Enlang from './locales/en-US';
import Zhlang from './locales/zh-CN';

import { addLocaleData } from 'react-intl';

const AppLocale = {
  en: Enlang,
  zh: Zhlang,

};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.zh.data);


export default AppLocale;