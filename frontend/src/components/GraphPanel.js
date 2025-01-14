import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
// import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';

import TopicsPanel from '../components/TopicsPanel';
import ChatPanel from '../components/ChatPanel';


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

export default function GraphPanel(props) {
  const {
    // nodes,
    // arcs,
  } = props;
  return sheet({
    sx: {
      height: "100%",
      py: 1,
      overflow: "auto",
    },
  }, vstack({
    gap: 1,
  }, [
    vNode('img', {src: `${'/Copilot-for-research'}/images/graph.png`}),
    ty({level: "body2", sx: {
      mt: 1,
      textAlign: "center",
    }}, "功能开发中"),
  ]));
};
