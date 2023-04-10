import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
// import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';
import { sortBy } from 'lodash';

import CircularProgress from '@mui/joy/CircularProgress';

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
} from '../lib/v-dom-joy';

import { backendApi } from '../api/backend';



export default function TagsPanel(props) {
  const {
    // tags,
    topic,
  } = props;

  const [loading, set_loading] = useState(true);

  const [tags, set_tags] = useState([]);

  const loadedOnce = useRef(null);
  useEffect(()=>{
    const fn = async()=>{
      if (loadedOnce.current) {return;};
      loadedOnce.current = true;
      const resp = await backendApi.getTopicTags(topic?.topic_id);
      console.log(resp);
      const got_tags = sortBy(resp?.data??[], "last_modified_ts");
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
  }, loading ? [
    sheet({
    }, vNode(CircularProgress, {
      variant: "soft",
      sx: {
        display: "flex",
        mx: "auto",
        mt: "2em",
      },
    })),
  ] : tags.map((tag, idx)=>smOutlinedCard({
    sx: {
      cursor: "pointer",
    },
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
  }, [
    `${tag?.tag_name??"<未命名标签>"} (${tag?.doc_count??0})`
  ]))));
};
