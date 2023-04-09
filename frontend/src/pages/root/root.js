import React, { useEffect } from 'react';
import vNode from '../../lib/vue-to-react';
import Lodash_pick from 'lodash/pick';

// import ChatLayout from '../../layouts/chat-layout';
import YoudianLayout from '../../layouts/youdian-layout';
// import DefaultLayout from '../../layouts/default-layout';

import {
  children,
  box, container, grid, stack,
  card, sheet,
  hstack, vstack,
  avatar, btn, iconBtn, ty,
  div, img, span, code, p,
} from '../../lib/v-dom-joy';

// import MacOSMenuBar from '../../components/MacOSMenuBar';

// import { useColorScheme } from '@mui/joy/styles';

import { myPage } from '../../components/MyPage';
// import DevDemo from './root-demo';
// import FreeStyleDemo from './root-freestyle';
// import DevFileLoader from './root-dev--file-loader';
// import DevFileReader from './root-dev--file-reader';
// import SchemaEditorPage from './root-schema-editor';

// import AppIntro from './root-home';

// // import { useSelector, useDispatch } from 'react-redux';
// // import { update as updateLocation } from '../../contexts/router-reducer';

// import GlobalValtio from '../../contexts/GlobalValtio';

// import { useHashInfo } from '../../api/router-hooks';
// import { useUserState } from '../../api/user-hooks';
// import { keyFor, urlFor } from '../../api/urls';

// import NotFoundPage from './root-404';
// import LoginPage from './root-login';
// import WorkspacePage from '../workspace/workspace';


import GlobalStateManagerValtio from '../../contexts/global-state';

import { backendApi } from '../../api/backend';
import { cloneDeep } from 'lodash';


export default function Root(props) {

  const globalState$proxy = GlobalStateManagerValtio.$proxy;

  // const globalState = GlobalStateManagerValtio.proxy;
  const loadFn = ()=>{
    const fn = async()=>{
      console.log('loading');
      const globalState = GlobalStateManagerValtio.proxy;
      const resp = await backendApi.getAllTopics();
      console.log(resp);
      const got_topics = resp?.data??[];
      console.log(got_topics);

      console.log(globalState);
      console.log(globalState.value);
      console.log(globalState.value.allTopics);

      console.log(globalState$proxy);
      // Object.assign(globalState$proxy, {ss:2});

      // globalState.value.allTopics.forEach(it=>globalState.value.allTopics.pop);
      // globalState.value.allTopicsLoading = false;
      globalState$proxy.value.allTopics = got_topics;
      globalState$proxy.value.allTopicsLoading = false;
    };
    fn();
  };
  useEffect(loadFn, []);


  return vNode(YoudianLayout, {
    onClickLoadingArea: ()=>{loadFn();},
  });

};

