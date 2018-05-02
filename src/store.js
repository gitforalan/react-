import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import config from './config/config';
import { doFetch, doDispatch } from './commonActions/fetch';
import { localItem } from './utils/myUtil';
//组合之后的reducer
import reducer from './reducers/reducers';


const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger())
}

//全局唯一的store,挂在window上方便控制台查看
window.store = createStore(
    reducer,
    compose(applyMiddleware(...middleware))
);



export default window.store;