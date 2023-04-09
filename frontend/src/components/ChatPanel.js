import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';

import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import CircularProgress from '@mui/joy/CircularProgress';

import AutoAwesomeRounded from '@mui/icons-material/AutoAwesomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Textarea from '@mui/joy/Textarea';

import { createPortal } from 'react-dom';

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
  toolBtn,
  blkBtn,
  smIconBtn, smBtn,
  clickAway,
  modal, modalDialog, modalClose,
} from '../lib/v-dom-joy';

import { backendApi } from '../api/backend';

import rangy from 'rangy';

import RangeSelector from '../lib/RangeSelector';

import { MessagePlugin } from 'tdesign-react';

const rangeSelector = new RangeSelector();

// getTopicConversations



function ChatInformationCard(props) {
  const {
    topic,
  } = props;
  return box({}, card({
    variant: "soft",
    color: "neutral",
    size: "sm",
    sx: {
      textAlign: "center",
      maxWidth: "400px",
      mx: "auto",
    },
  }, [
    ty({level: "body2"}, `已导入 ${topic?.topic_name} 相关文档 ${topic?.doc_count} 篇，并建立 ${topic?.tag_count} 个标签`),
  ]));
};

function ChatCardPair(props) {
  const {
    conversation,
    idx,
  } = props;

  return vstack({spacing: 2}, [
    card({
      variant: "outlined",
      color: "primary",
      size: "sm",
      sx: {
        maxWidth: "800px",
        ml: "auto",
      },
    }, [
      ty({
        level: "body1", color: "primary",
        whiteSpace: "pre-line",
      }, conversation?.question??""),
    ]),
    card({
      variant: "outlined",
      color: "neutral",
      size: "sm",
      sx: {
        maxWidth: "800px",
        mr: "auto",
      },
    }, [
      ty({
        level: "body1",
        whiteSpace: "pre-line",
        class: "can-select",
        "data-conversation-id": conversation?.conversation_id,
      }, conversation?.answer??""),
      !conversation?.next_keywords?.length ? null :
      sheet({sx: {mt: 1}}, [
        ty({
          level: "body3",
          // whiteSpace: "pre-line",
        }, "建议:"),
        sheet({}, conversation.next_keywords.map((keyword, idx)=>smBtn({variant: "outlined", sx: {mr: 0.5, mt:0.5}}, keyword))),
      ]),
    ]),
  ]);

};


function LoadingCard(props) {
  return box({}, card({
    ...props,
    variant: "plain",
    color: "neutral",
    size: "sm",
    sx: {
      textAlign: "center",
      maxWidth: "400px",
      mx: "auto",
      boxShadow: "none",
    },
  }, [
    ty({level: "body2"}, `正在加载...`),
  ]));
};



// const tmpGrid = ()=>{};

function ChatList(props) {
  const {
    topic,
    ...otherProps
  } = props;

  const [conversations, set_conversations] = useState([]);
  const [loading, set_loading] = useState(true);

  const loadFn = ()=>{
    const fn = async()=>{
      console.log('loading chat');
      const resp = await backendApi.getTopicConversations(topic?.topic_id);
      console.log(resp);
      const got_conversations = resp?.data??[];
      console.log(got_conversations);
      set_conversations(got_conversations);
      set_loading(false);
    };
    fn();
  };


  useEffect(loadFn, []);


  return container({
    ...otherProps,
  }, [
    sheet({
      sx: {
        // border: "1px red solid",
        py: 2,
        // overflow: "auto",
      },
    }, vstack({
      spacing: 2,
    }, [

      vNode(ChatInformationCard, {
        topic: topic,
      }),

      ... loading ? [vNode(LoadingCard, {
        onClick: ()=>{loadFn();},
      })] : conversations.map((conversation, idx)=>vNode(ChatCardPair, {
        key: `conversation-${topic?.topic_id}[${idx}]-${conversation.conversation_id}`,
        id: `conversation-${topic?.topic_id}[${idx}]-${conversation.conversation_id}`,
        conversation,
        idx,
      })),

    ])),
  ]);
};


function TextareaField(props) {
  const [text, set_text] = React.useState(props?.text??'');
  React.useEffect(()=>{set_text(props?.text);}, [props?.text]);
  return vNode(FormControl, {}, [
    // vNode(FormLabel, {}, ty({level: 'body3', fontWeight: 'lg'}, 'FreeStyle')),
    vNode(Textarea, {
      value: text,
      onChange: (event)=>{set_text(event.target.value);},
      minRows: 1,
      maxRows: 3,
      // placeholder: 'The quick brown fox jumps over the lazy dog.',
      endDecorator: smBtn({
        sx: {ml: 'auto'},
        color: 'primary',
        variant: 'soft',
        onClick: (event)=>{props?.onClickButton?.(text, event);},
      }, vNode(SendRoundedIcon)),
    }),
    // vNode(FormHelperText, {}, "Type some sentences and try..."),
  ]);
};




function ToolBar(props) {

  const {
    topic_id,
    positionOfTheToolBar,
    showTheToolBar,
    set_showTheToolBar,
    selectedObj,
  } = props;


  const [showModalHX, set_showModalHX] = useState(false);
  const [showModalPL, set_showModalPL] = useState(false);
  const [showModalBQ, set_showModalBQ] = useState(false);

  const [commentText, set_commentText] = useState("");


  const theToolBar = vNode(null, null, createPortal(clickAway({
    onClickAway: (...args)=>{
      //
    },
  }, box({
    // size: 'sm',
    // color: 'neutral',
    // variant: 'soft',
    // invertedColors: true,
    sx: {
      position: 'absolute',
      left: positionOfTheToolBar?.x??0,
      top: (positionOfTheToolBar?.y??0)+10,
      // p: '1px',
      // opacity: showTheToolBar ? null : 0,
      // pointerEvents: showTheToolBar ? 'auto' : 'none',
      // // transition: "opacity 0.25s, left 0.25s, top 0.25s",
      // transition: 'opacity 0.25s',
    },
  }, tooltip({
    size: 'sm',
    color: 'neutral',
    variant: 'plain',
    // invertedColors: true,
    open: showTheToolBar,
    arrow: false,
    title: sheet({
      size: 'sm',
      color: 'neutral',
      variant: 'plain',
      invertedColors: true,
      // sx: {
      //   opacity: showTheToolBar ? null : 0,
      //   pointerEvents: showTheToolBar ? 'auto' : 'none',
      //   // transition: "opacity 0.25s, left 0.25s, top 0.25s",
      //   transition: 'opacity 0.25s',
      // },
    }, hstack({gap: 0.5,}, [
      btn({
        size: 'sm', variant: 'outlined',
        onClick: async()=>{
          set_showTheToolBar(false);
          // set_showModalHX(true);
          await backendApi.createNewNote();
        },
        onClick: async()=>{
          set_showTheToolBar(false);
          const m1 = MessagePlugin.info(`正在处理`);
          // set_showModalBQ(true);
          const the_text = selectedObj?.text??"";
          const sliced = the_text.slice(0,10)+(the_text.length>10?"...":"");

          await backendApi.createNewNote(topic_id, selectedObj?.conversation_id, the_text, selectedObj?.start, selectedObj?.end, null).then(()=>{
            //
            MessagePlugin.close(m1);
            MessagePlugin.success(`成功添加划线笔记“${sliced}”`, 3_000);
          }).catch(()=>{
            //
            MessagePlugin.error(`添加划线笔记“${sliced}”失败！`, 5_000);
          });
        },
      }, '划线'),
      btn({
        size: 'sm', variant: 'outlined',
        onClick: ()=>{
          set_showTheToolBar(false);
          set_showModalPL(true);
        },
      }, '评论'),
      btn({
        size: 'sm', variant: 'outlined',
        onClick: async()=>{
          set_showTheToolBar(false);
          const m1 = MessagePlugin.info(`正在处理`);
          // set_showModalBQ(true);
          await backendApi.createNewTag(topic_id, selectedObj?.text).then(()=>{
            //
            MessagePlugin.close(m1);
            MessagePlugin.success(`成功添加标签“${selectedObj?.text}”`, 3_000);
          }).catch(()=>{
            //
            MessagePlugin.error(`添加标签“${selectedObj?.text}”失败！`, 5_000);
          });
        },
      }, '标签'),

    ])),
    placement: "bottom",
  }, box({})))), document?.body));

  return box({}, [
    theToolBar,


    // modal({
    //   open: showModalHX,
    //   onClose: ()=>{
    //     set_showModalHX(false);
    //   },
    //   sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    // }, modalDialog({size: 'sm', sx: {p: 1}}, [
    //   modalClose({sx: {zIndex: 1}}),
    //   ty({level: "h5"}, "添加划线笔记"),
    //   sheet({
    //     sx: {pt: 1},
    //   },[
    //     ty({}, "将以下内容添加到笔记："),
    //     ty({}, selectedObj?.text??""),
    //     box({}, [
    //       hstack({display: "inline-flex", mt:1 , ml: "auto", spacing: 0.5}, [
    //         smBtn({color:"neutral", variant: "soft", onClick: ()=>{set_showModalHX(false);}}, "取消"),
    //         smBtn({}, "确定"),
    //       ]),
    //     ]),
    //   ]),
    // ])),

    modal({
      open: showModalPL,
      onClose: ()=>{
        set_showModalPL(false);
      },
      sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    }, modalDialog({size: 'sm', sx: {p: 1}}, [
      modalClose({sx: {zIndex: 1}}),
      ty({level: "h5"}, "添加评论"),
      sheet({
        sx: {pt: 1},
      },[
        ty({}, "为以下内容添加评论："),
        ty({}, selectedObj?.text??""),
        //
        vNode(Textarea, {
          sx: {
            mt: 1,
          },
          value: commentText,
          onChange: (event)=>{set_commentText(event.target.value);},
          minRows: 1,
          maxRows: 3,
        }),
        box({}, [
          hstack({display: "inline-flex", mt: 1, ml: "auto", spacing: 0.5}, [
            smBtn({color:"neutral", variant: "soft", onClick: ()=>{set_showModalPL(false);}}, "取消"),
            smBtn({}, "确定"),
          ]),
        ]),
      ]),
    ])),

    modal({
      open: showModalBQ,
      onClose: ()=>{
        set_showModalBQ(false);
      },
      sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    }, modalDialog({size: 'sm', sx: {p: 1}}, [
      modalClose({sx: {zIndex: 1}}),
      ty({level: "h5"}, "添加标签"),
      sheet({
        sx: {pt: 1},
      },[
        ty({}, "将以下内容作为标签添加："),
        ty({}, selectedObj?.text??""),
        box({}, [
          hstack({display: "inline-flex", mt:1 , ml: "auto", spacing: 0.5}, [
            smBtn({color:"neutral", variant: "soft", onClick: ()=>{set_showModalBQ(false);}}, "取消"),
            smBtn({}, "确定"),
          ]),
        ]),
      ]),
    ])),
  ]);
};



export default function ChatPanel(props) {
  const {
    topic,
    ...otherProps
  } = props;


  //

  const [positionOfTheToolBar, set_positionOfTheToolBar] = useState({ x: 0, y: 0 });
  const [showTheToolBar, set_showTheToolBar] = useState(false);
  const [selectedObj, set_selectedObj] = useState({});



  useEffect(()=>{
    const theFn = function() {
      // const selection = window.getSelection();
      const currentSelection = rangy.getSelection();

      if (
        (Array.from(currentSelection?.anchorNode?.parentElement?.classList).includes("can-select"))
        &&
        (currentSelection?.anchorOffset!=currentSelection?.focusOffset)
        &&
        currentSelection?.toString?.()?.length
      ) {
        // 应该选取
        console.log('应该选取');
        console.log('selection\n', currentSelection);
        const text = currentSelection.toString();
        console.log("选区文本: " + text);
        const anchorOffset = currentSelection?.anchorOffset??0;
        console.log("anchorOffset: " + anchorOffset);
        const focusOffset = currentSelection?.focusOffset??0;
        console.log("focusOffset: " + focusOffset);

        const start = Math.min(anchorOffset, focusOffset);
        const end = Math.max(anchorOffset, focusOffset);
        console.log("start: " + start);
        console.log("end: " + end);

        const conversation_id = currentSelection?.anchorNode?.parentElement?.dataset?.conversationId;

        const new_selectedObj = {
          text, start, end, conversation_id,
        };
        console.log("new_selectedObj: " + new_selectedObj);
        set_selectedObj(new_selectedObj);
        // set_positionOfTheToolBar({ x: 100, y: 100 });
        set_showTheToolBar(true);
      } else {
        // 取消选取
        // if (!currentSelection?.toString?.()?.length) {
          console.log('取消选取');
          set_showTheToolBar(false);
        // };
      };

    };
    const theFn2 = function(event) {
      //
      // const currentSelection = rangy.getSelection();
      // const selected = !!currentSelection?.toString?.()?.length;
      if (
        // (!selected)&&
        (!showTheToolBar)
      ) {
        set_positionOfTheToolBar({x: event?.clientX??0, y: event?.clientY??0});
      };
    };
    document.addEventListener('selectionchange', theFn);
    document.addEventListener('mouseup', theFn2);
    return ()=>{
      document.removeEventListener('selectionchange', theFn);
      document.removeEventListener('mouseup', theFn2);
    };
  }, []);

  useEffect(()=>{
    rangy.init();
    console.log("rangy:\n", rangy);
  }, []);


  return vstack({
    ...otherProps,
    height: "100%",
    justifyContent: "space-between",
  }, [
    vNode(ChatList, {
      topic,
      sx: {
        flexGrow: 1,
        flexShrink: 1,
        overflow: "auto",
      },
    }),
    sheet({
      sx: {
        padding: 1,
      },
    }, vNode(TextareaField, {
      text: "",
      onClickButton: (text, event)=>{},
    })),
    vNode(ToolBar, {
      topic_id: topic?.topic_id,
      positionOfTheToolBar,
      showTheToolBar,
      set_showTheToolBar,
      selectedObj,
    }),
  ]);
};

