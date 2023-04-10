import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
// import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';

import TopicsPanel from '../components/TopicsPanel';
import ChatPanel from '../components/ChatPanel';

// import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';

import { DialogPlugin } from 'tdesign-react';

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
  smBtn,
  smIconBtn,
} from '../lib/v-dom-joy';


const fakeTags = [
  {
    tag_id: "00",
    name: "永乐大典",
    doc_count: 32,
  },
  {
    tag_id: "01",
    name: "明朝",
    doc_count: 32,
  },
  {
    tag_id: "02",
    name: "朱棣",
    doc_count: 32,
  },
];

export default function PersonalDbCorner(props) {
  return sheet({}, hstack({
    pt: 2,
    pb: 1.6,
    spacing: 2,
    justifyContent: "center",
    alignItems: "center",
  }, [
    box({
      textAlign: "center",
    }, ["个人数据库 · 共12370篇"]),
    box({}, smIconBtn({
      variant: "plain",
      color: "neutral",
      onClick: ()=>{
        const alertDia = DialogPlugin.alert({
          header: '功能开发中',
          body: '敬请期待！',
          confirmBtn: {
            content: '好的',
          },
          onConfirm: ({ e }) => {
            alertDia.hide();
          },
          onClose: ({ e, trigger }) => {
            alertDia.hide();
          },
        });
      },
    }, vNode(UploadRoundedIcon))),
  ]))
};
