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

import { backendApi } from '../api/backend';



export default function TagsPanel(props) {
  const {
    // tags,
    topic,
  } = props;

  const [loading, set_loading] = useState(true);

  const [tags, set_tags] = useState([]);

  useEffect(()=>{
    const fn = async()=>{
      const resp = await backendApi.getTopicTags(topic?.topic_id);
      console.log(resp);
      const got_tags = resp?.data??[];
      console.log(got_tags);
      set_tags(got_tags);
      set_loading(false);
    };
    fn();
  }, []);


  return sheet({
    sx: {
      height: "100%",
      py: 1,
      overflow: "auto",
    },
  }, vstack({
    gap: 1,
  }, tags.map((tag, idx)=>smOutlinedCard({}, [
    `${tag?.tag_name??"<未命名标签>"} (${tag?.doc_count??0})`
  ]))));
};
