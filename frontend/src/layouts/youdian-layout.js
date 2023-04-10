import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
// import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';

import TopicsPanel from '../components/TopicsPanel';
import ChatPanel from '../components/ChatPanel';
import PersonalDbCorner from '../components/PersonalDbCorner';
import NotesPanel from '../components/NotesPanel';
import TagsPanel from '../components/TagsPanel';
import GraphPanel from '../components/GraphPanel';


import ListItemDecorator from '@mui/joy/ListItemDecorator';

import TagRoundedIcon from '@mui/icons-material/TagRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';


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

import { Tabs } from 'tdesign-react';
const { TabPanel } = Tabs;
import 'tdesign-react/es/style/index.css';

import GlobalStateManagerValtio from '../contexts/global-state';


import { backendApi } from '../api/backend';




function RightPanel(props) {
  const {
    // onClickLoadingArea,
    topic,
  } = props;
  const rightSideArea = sheet({
    id: "rightSideArea",
    sx: {
      display: "flex",
      height: "100%",
      // minWidth: "320px",
      width: "320px",
      pl: 0.6,
    },
  }, vstack({
    height: "100%",
    width: "100%",
    flexGrow: 1,
    flexShrink: 1,
  }, [

    vNode(PersonalDbCorner, {}),

    smOutlinedCard({
      // size: "sm",
      // variant: "outlined",
      sx: {
        mb: 0.6,
        flexGrow: 1,
        flexShrink: 1,
        overflow: "auto",
        boxShadow: "none",
      },
    }, tabs({
      size: "sm",
      defaultValue: 0,
      sx: {
        display: "flex",
      },
    }, [
      tabList({
        size: "sm",
      }, [
        tab({}, [vNode(ListItemDecorator, null, vNode(TagRoundedIcon)), "标签"]),
        tab({}, [vNode(ListItemDecorator, null, vNode(HubRoundedIcon)), "图示"]),
        tab({}, [vNode(ListItemDecorator, null, vNode(BookmarkBorderRoundedIcon)), "笔记"]),
      ]),
      tabPanel({
        sx: {
          flexGrow: 1,
          flexShrink: 1,
          overflow: "auto",
        },
        value: 0,
      }, vNode(TagsPanel, {topic})),
      tabPanel({
        sx: {
          flexGrow: 1,
          flexShrink: 1,
          overflow: "auto",
        },
        value: 1,
      }, vNode(GraphPanel, {topic})),
      tabPanel({
        sx: {
          flexGrow: 1,
          flexShrink: 1,
          overflow: "auto",
        },
        value: 2,
      }, vNode(NotesPanel, {topic})),
    ]),)
  ]));
  return rightSideArea;
};



function TabArea(props) {
  const {onClickLoadingArea} = props;

  const globalState$context = GlobalStateManagerValtio.$context;

  const openedPanels$snapshot = GlobalStateManagerValtio.$snapshot.value.openedPanels;
  console.log('openedPanels$snapshot\n', openedPanels$snapshot);
  const currentTab$snapshot = GlobalStateManagerValtio.$snapshot.value.currentTab;


  const tabArea = vNode(Tabs, {
    placement: "top",
    size: "medium",
    theme: 'card',
    defaultValue: 0,
    value: currentTab$snapshot,
    onChange: (newVal)=>{
      globalState$context.value.currentTab = newVal;
      // set_currentTabValue(newVal);
    },
    // addable: false,
  }, [
    vNode(TabPanel, {
      key: 0,
      value: 0,
      label: 'home',
      removable: false,
    }, [box({
      // height: "calc(100vh - 48px)",
    }, [

      vNode(TopicsPanel, {
        onClickLoadingArea,
        onClickTopic: (topic)=>{
          // console.log('onClickTopic\n', topic);
          const newVal = openedPanels$snapshot?.length+1;
          globalState$context.value.openedPanels.push({
            value: newVal,
            topic: topic,
          });
          console.log('globalState$context.value.openedPanels\n', globalState$context.value.openedPanels);
          globalState$context.value.currentTab = newVal;
          // set_currentTabValue(newVal);
        },
      }, []),
    ])]),

    ...openedPanels$snapshot.map((panel, idx)=>vNode(TabPanel, {
      key: panel?.topic?.topic_id!=null ? `topic-${panel.topic.topic_id}` : `value-${panel.value}`,
      value: panel.value,
      label: panel?.topic?.topic_name,
      removable: true,
      onRemove: ()=>{
        // console.log('onRemove one');
        globalState$context.value.openedPanels = openedPanels$snapshot.filter((it) => it.value !== panel.value);
        globalState$context.value.currentTab = 0;
        // console.log('globalState$context.value.openedPanels\n', globalState$context.value.openedPanels);
        return globalState$context.value.openedPanels;
      },
    }, [hstack({
      // height: "calc(100vh - 48px)",
      id: "box-t1",
      height: "100%",
      // overflow: "auto",
    }, [
      vNode(ChatPanel, {
        topic: panel?.topic,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
      }, []),
      vNode(RightPanel, {
        topic: panel?.topic,
      }),
    ])])),
  ]);



  return tabArea;
}





export default function YoudianLayout(props) {
  const {onClickLoadingArea} = props;

  const theMainArea = box({
    id: "theMainArea",
    height: "100%",
    flexGrow: 1,
    sx: {
      '&#theMainArea .t-tabs': {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        '& .t-tabs__content': {
          flexGrow: 1,
          '& .t-tab-panel': {
            height: "100%",
            // overflow: "auto",
          },
        },
      },
    },
  }, vNode(TabArea, {onClickLoadingArea}));



  const layout = box({
    id: "layoutMain",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  }, theMainArea);

  return layout;
};
