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





const 滚下去 = (delay=10)=>{
  setTimeout(()=>{
    console.log("滚下去");
    const element = document?.getElementById?.("chatList");
    // console.log(element?.scrollHeight);
    element?.scrollTo({
      top: element?.scrollHeight,
      behavior: "smooth"
    });
  }, delay);
};




function ChatInformationCard(props) {
  const {
    topic,
    onSend,
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
    onSend,
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
    conversation?.isTmp ? 
    card({
      variant: "outlined",
      color: "neutral",
      size: "sm",
      sx: {
        maxWidth: "800px",
        mr: "auto",
      },
    }, vNode(CircularProgress, {
      variant: "soft",
      sx: {
        display: "flex",
        mx: "auto",
        my: "1em",
      },
    }))
    :
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
      }, conversation?.answer?.length ? conversation?.answer : conversation?.conversation_type=="summary" ? "暂无此信息源相关内容" : ""),
      (!conversation?.doc_title?.length) ? null :
      ty({
        level: "body2",
        whiteSpace: "pre-line",
        mt: 0.75,
        cursor: "pointer",
      }, [
        `信息源：`,
        ty({
          color: 'primary', sx: {cursor: "pointer"},
          onClick: ()=>{
            onSend(`关于 ${conversation?.doc_title}`, "summary", conversation?.doc_id);
          },
        }, `${conversation?.doc_title??""}`),
      ]),
      (!conversation?.next_keywords?.length) ? null :
      sheet({sx: {mt: 0.75}}, [
        ty({
          level: "body3",
          // whiteSpace: "pre-line",
        }, "你可能还想了解:"),
        sheet({}, conversation.next_keywords?.map?.((keyword, idx)=>smBtn({
          variant: "outlined", sx: {mr: 0.5, mt:0.5, fontWeight: "md"},
          onClick: ()=>{
            onSend(keyword, "question");
          },
        }, keyword))),
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
    conversations, set_conversations,
    loading, set_loading,

    onSend,

    ...otherProps
  } = props;

  const loadedOnce = useRef(null);
  const loadFn = ()=>{
    if (loadedOnce.current) {return;};
    loadedOnce.current = true;
    const fn = async()=>{
      console.log('loading chat');
      const resp = await backendApi.getTopicConversations(topic?.topic_id);
      console.log(resp);
      const got_conversations = resp?.data??[];
      console.log(got_conversations);
      set_conversations(got_conversations);
      set_loading(false);
      // 滚下去(1000);
    };
    fn();
  };


  useEffect(loadFn, []);


  return container({
    ...otherProps,
    id: "chatList",
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
        onSend,
      }),

      ... loading ? [vNode(LoadingCard, {
        onClick: ()=>{loadFn();},
      })] : conversations.map((conversation, idx)=>vNode(ChatCardPair, {
        key: `conversation-${topic?.topic_id}[${idx}]-${conversation.conversation_id}`,
        id: `conversation-${topic?.topic_id}[${idx}]-${conversation.conversation_id}`,
        conversation,
        idx,
        onSend,
      })),

    ])),
  ]);
};


function TextareaField(props) {
  const {
    inputText,
    set_inputText,
    onChange,
    onClickButton,
  } = props;
  // const [text, set_text] = React.useState(props?.text??'');
  // React.useEffect(()=>{set_text(props?.text);}, [props?.text]);
  return vNode(FormControl, {}, [
    // vNode(FormLabel, {}, ty({level: 'body3', fontWeight: 'lg'}, 'FreeStyle')),
    vNode(Textarea, {
      value: inputText,
      // onChange: (event)=>{set_inputText(event.target.value);},
      onChange,
      minRows: 1,
      maxRows: 3,
      // placeholder: 'The quick brown fox jumps over the lazy dog.',
      endDecorator: smBtn({
        sx: {ml: 'auto'},
        color: 'primary',
        variant: 'soft',
        onClick: (event)=>{onClickButton?.(inputText, event);},
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
            smBtn({
              onClick: async()=>{
                set_showTheToolBar(false);
                set_showModalPL(false);
                const m1 = MessagePlugin.info(`正在处理`);
                // set_showModalBQ(true);
                const the_text = selectedObj?.text??"";
                const sliced = the_text.slice(0,10)+(the_text.length>10?"...":"");

                await backendApi.createNewNote(topic_id, selectedObj?.conversation_id, the_text, selectedObj?.start, selectedObj?.end, commentText).then(()=>{
                  //
                  MessagePlugin.close(m1);
                  MessagePlugin.success(`成功添加笔记“${sliced}”`, 3_000);
                }).catch(()=>{
                  //
                  MessagePlugin.error(`添加笔记“${sliced}”失败！`, 5_000);
                });
              },
            }, "确定"),
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





  const onSend = async(text, type="question", doc_id, event)=>{
    console.log("\nonSend\n");
    const m1 = MessagePlugin.info(`正在处理`);
    try {
      const history = cloneDeep(conversations);

      const tmpConversations = [...history, {
        isTmp: true,
        question: text,
      }];
      set_conversations(tmpConversations);
      set_inputText("");

      滚下去();

      console.log("\nflag1\n");


      const resp = await backendApi.createNewConversation(type, topic?.topic_id, doc_id, text);
      console.log("\nflag2 1\n");
      console.log(resp);
      console.log("\nflag2 2\n");
      console.log(resp?.data);
      console.log("\nflag2 3\n");

      const newConversations = [...history, resp?.data];

      console.log("\nflag2 4\n");
      set_conversations(newConversations);
      //
      MessagePlugin.close(m1);
      // MessagePlugin.success(`成功添加笔记“${sliced}”`, 3_000);
      set_inputText("");
      滚下去();
      console.log("\nflag3\n");
    } catch(error) {
      console.log(error);
      MessagePlugin.error(`发生错误！`, 5_000);
      滚下去();
    };
  };


  const loadedOnce = useRef(null);
  useEffect(()=>{
    const theFn = function() {
      // if (loadedOnce.current) {return;};
      // loadedOnce.current = true;
      // const selection = window.getSelection();
      const currentSelection = rangy?.getSelection?.();

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
      // if (loadedOnce.current) {return;};
      // loadedOnce.current = true;
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

  const [inputText, set_inputText] = useState("");

  const [conversations, set_conversations] = useState([]);
  const [conversationsLoading, set_conversationsLoading] = useState(true);


  return vstack({
    ...otherProps,
    height: "100%",
    justifyContent: "space-between",
  }, [
    vNode(ChatList, {
      topic,
      conversations,
      set_conversations,
      loading: conversationsLoading,
      set_loading: set_conversationsLoading,

      onSend,

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
      inputText,
      set_inputText,
      onChange: (event)=>{
        const newVal = event?.target?.value;
        // console.log(newVal);
        set_inputText(newVal);
      },
      onClickButton: (event)=>{onSend(inputText, "question", null, event);},
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

