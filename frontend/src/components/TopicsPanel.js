import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';

import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import CircularProgress from '@mui/joy/CircularProgress';

import GlobalStateManagerValtio from '../contexts/global-state';



import {
  children,
  box, container, grid, stack,
  card, sheet,
  smOutlinedCard,
  hstack, vstack,
  tabs, tabList, tab, tabPanel,
  avatar, btn, iconBtn, ty,
  div, img, span, code, p,
  drawer,
  tooltip,
  modal,
  toolBtn,
  blkBtn,
} from '../lib/v-dom-joy';

import { backendApi } from '../api/backend';



const fakeTopics = [
  {
    topic_name: "永乐大典",
  },
  {
    topic_name: "你好呀",
  },
];

// const tmpGrid = ()=>{};

export default function (props) {

  const {
    // topics,
    onClickLoadingArea,
    onClickTopic,
  } = props;

  // const [loading, set_loading] = useState(true);

  // const [topics, set_topics] = useState([]);

  const loading = GlobalStateManagerValtio.$snapshot.value.allTopicsLoading;
  const topics = GlobalStateManagerValtio.$snapshot.value.allTopics;

  // useEffect(()=>{
  //   const fn = async()=>{
  //     const resp = await backendApi.getAllTopics().catch((reason)=>{
  //       console.log(reason);
  //       return fakeTopics;
  //     });
  //     console.log(resp);
  //     const got_topics = resp?.data??[];
  //     console.log(got_topics);
  //     set_topics(got_topics);
  //     set_loading(false);
  //   };
  //   fn();
  // }, []);




  // useEffect(()=>{
  //   const globalState = GlobalStateManagerValtio.proxy;
  //   console.log(globalState?.value?.allTopicsLoading);
  //   console.log(JSON.stringify(globalState?.value?.allTopicsLoading));
  //   console.log(JSON.stringify(GlobalStateManagerValtio.proxy, null, 2));
  //   const subscribe = GlobalStateManagerValtio.valtio.subscribe;
  //   const unsubscribe_allTopicsLoading = subscribe(globalState?.value?.allTopicsLoading, ()=>{
  //     console.log('happy');
  //   });
  //   return (()=>{unsubscribe_allTopicsLoading();});


  //   // const unsubscribe_allTopicsLoading = GlobalStateManagerValtio.valtio.subscribe(globalState?.value?.allTopicsLoading, ()=>{
  //   //   set_loading(cloneDeep(globalState?.value?.allTopicsLoading)??true);
  //   // });
  //   // return (()=>{unsubscribe_allTopicsLoading();});
  // }, []);


  // useEffect(()=>{
  //   const globalState = GlobalStateManagerValtio.proxy;
  //   const unsubscribe_allTopicsLoading = GlobalStateManagerValtio.valtio.subscribe(globalState.value.allTopicsLoading, ()=>{
  //     // set_loading(cloneDeep(globalState.value.allTopicsLoading)??true);
  //   });
  //   const unsubscribe_allTopics = GlobalStateManagerValtio.valtio.subscribe(globalState.value.allTopics, ()=>{
  //     // set_topics(cloneDeep(globalState.value.allTopics)??[]);
  //     // set_loading(false);
  //   });
  //   return (()=>{
  //     unsubscribe_allTopicsLoading();
  //     unsubscribe_allTopics();
  //   });
  // }, []);




  return sheet({
    sx: {
      padding: 2,
    },
  }, grid({
    container: true,
    spacing: 2,
  }, loading ? [
    sheet({
      onClick: ()=>{onClickLoadingArea?.();},
      sx: {
        width: "100%",
      },
    }, vNode(CircularProgress, {
      variant: "soft",
      sx: {
        display: "flex",
        mx: "auto",
        mt: "2em",
      },
    })),
  ] : (topics??[]).map(topic => grid({
    xs: 12, sm: 6, md: 4,
  }, smOutlinedCard({
    sx: {
      cursor: "pointer",
      textAlign: "center",
      py: 5,
    },
    onClick: ()=>{onClickTopic?.(topic);},
  }, [ty({level: "h4"}, topic?.topic_name??"<未命名的课题>")])))));
};
