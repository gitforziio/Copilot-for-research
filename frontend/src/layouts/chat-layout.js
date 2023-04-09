import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';
import Lodash_debounce from 'lodash/debounce';
import { cloneDeep } from 'lodash';

import { useTheme } from '@mui/joy/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import {
  children,
  box, container, grid, stack,
  card, sheet,
  hstack, vstack,
  avatar, btn, iconBtn, ty,
  div, img, span, code, p,
  drawer,
  tooltip,
  modal,
  toolBtn,
  blkBtn,
} from '../lib/v-dom-joy';

// import { styled } from '@mui/joy/styles';

// import { myPage, MyPage } from '../components/MyPage';
import { myTopNavBar, MyTopNavBar } from '../components/MyTopNavBar';

import ThemeContext from '../contexts/theme-context';

import { useColorScheme } from '@mui/joy/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';

import GitHubIcon from '@mui/icons-material/GitHub';

import { cornerTools } from './default-layout--corner-tools';
import { statusBar, statusBarHolder } from './default-layout--status-bar';
import { sideDrawer } from './chat-layout--side-drawer';
import { fontWeight } from '@mui/system';

// import { useUserState } from '../api/user-hooks';

// import { goTo } from '../api/urls';

import GlobalStateManagerValtio from '../contexts/global-state';
import { nanoid } from 'nanoid';


export default function ChatLayout(props) {
  const globalState = GlobalStateManagerValtio.proxy;
  const globalStateSnap = GlobalStateManagerValtio.$snapshot_not_sync;

  const { mode, systemMode, setMode } = useColorScheme();
  // const { userState, userReducers, dispatch } = useUserState();
  useEffect(()=>{
    if (globalState?.value?.settings?.darkMode!=null) {
      if (globalState.value.settings.darkMode) {
        setMode('dark');
        document.documentElement.setAttribute('theme-mode', 'dark');
      } else {
        setMode('light');
        document.documentElement.removeAttribute('theme-mode');
      };
    };
  }, []);

  const theme = useTheme();
  // const isUpXs = useMediaQuery(theme.breakpoints.up('xs'));
  // const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'));
  // const isUpLg = useMediaQuery(theme.breakpoints.up('lg'));
  // const isUpXl = useMediaQuery(theme.breakpoints.up('xl'));






  // const themeContext = useContext(ThemeContext);

  const themeColor = 'neutral';
  // const themeColor = themeContext.color;

  const logoChunk = (hideText) => hstack({
    flexGrow: 1,
  }, hstack({
    mx: isUpMd?undefined:'auto',
    // transition: 'margin-left 0.5s ease, margin-right 0.5s ease',
    gap: 1,
  }, [
    // iconBtn({size: 'sm',}, img({src: "/icon/UniAP-icon-bg-transparent.svg",})),
    avatar({
      size: 'sm',
      color: 'neutral',
      variant: 'soft',
      src: `${'/Copilot-for-research'}/icon/dian.svg`,
      sx: {
        cursor: 'pointer',
      },
      // onClick: ()=>{
      //   goTo('home');
      //   setTimeout(()=>{window.scrollTo({top: 0, behavior: 'smooth'});}, 10);
      // },
    }),
    hideText?null:ty({
      level: 'h5',
      component: 'h1',
      fontWeight: 'lg',
      sx: {
        cursor: 'pointer',
      },
      // onClick: ()=>{
      //   goTo('home');
      //   setTimeout(()=>{window.scrollTo({top: 0, behavior: 'smooth'});}, 10);
      // },
    }, '有典文化'),
  ]));



  const userAvatar = ()=> !true ? null : tooltip({
    title: `${66}`,
    arrow: true,
    variant: 'outlined',
  }, avatar({
    size: 'sm',
    color: 'neutral',
    variant: 'soft',
    sx: {
      cursor: 'pointer',
    },
  }, "IJ"));






  const [openSideBar, set_openSideBar] = useState(false);

  const closeSideBar = (reason="default")=>{
    set_openSideBar(false);
  };


  const menuBtn = ()=>children({key: 'menu'}, toolBtn({
    useIcon: true,
    title: (openSideBar&&!isUpMd) ? "close" : "menu",
    color: 'neutral',
    variant: 'plain',
    size: 'md',
    onClick: ()=>{
      set_openSideBar(!openSideBar);
    },
  }, vNode((openSideBar&&!isUpMd) ? CloseRoundedIcon : MenuRoundedIcon)),);
  const addBtn = ()=>children({key: 'add'}, toolBtn({
    useIcon: true,
    title: "new chat",
    color: 'neutral',
    variant: 'plain',
    size: 'md',
    onClick: ()=>{
      console.log("dda");
      globalState?.value?.chatLogs?.forEach?.(it=>{it.isActive=undefined;});
      const the_new_key = nanoid();
      globalState?.value?.chatLogs?.unshift?.({
        _key: the_new_key,
        isActive: true,
      });
      globalState.value.currentChatKey = the_new_key;
    },
  }, vNode(AddRoundedIcon)));


  const leftChunk = () => hstack({
    // spacing: 1,
    sx: {
      // ml: 'auto',
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      // flexGrow: 1,
      minWidth: 'min-content',
    },
  }, [
    menuBtn(),
    // userAvatar(),
  ]);

  const rightChunk = () => hstack({
    // spacing: 1,
    sx: {
      // ml: 'auto',
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      // flexGrow: 1,
      minWidth: 'min-content',
    },
  }, [
    addBtn(),
  ]);



  const [sideWidth, set_sideWidth] = useState(280);

  const [atTop, set_atTop] = useState(false);
  const [collapseTopNav, set_collapseTopNav] = useState(false);
  useEffect(()=>{
    let scrollPosition = 0;

    const theFn = Lodash_debounce(function() {
      const currentPosition = window.pageYOffset;
      if (currentPosition < 120) {
        set_atTop(true);
        set_collapseTopNav(false);
      } else {
        set_atTop(false);
        if (currentPosition > scrollPosition) {
          set_collapseTopNav(true);
        } else {
          set_collapseTopNav(false);
        }
      };
      scrollPosition = currentPosition;
    }, 100);

    window.addEventListener('scroll', theFn);
    return ()=>{window.removeEventListener('scroll', theFn);};
  }, []);



  const sideBarTop = ()=> myTopNavBar({
    component: 'nav',
    variant: 'plain', color: themeColor, invertedColors: true,
    maxWidthTransition: true, containerProps: { sx: {
      maxWidth: '100%',
      px: {xs: 0.6, sm: 0.6, md: 0.6, lg: 0.6, xl: 0.6},
    }, },
    sx: {
      py: 0.6,
      backgroundColor: theme=>theme.vars.palette.background.backdrop,
      borderBottom: theme=>`1px solid ${theme.vars.palette.neutral.softBg}`,
    },
  }, [
    box({
      sx: {
        display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1,
        minWidth: 'min-content',
      },
    }, [ isUpMd?null:leftChunk(), logoChunk(!isUpMd), rightChunk(), ]),
  ]);

  const sideBarBottom = ()=> sheet({
    sx: {
      py: 1.6,
      px: 1.2,
      borderTop: theme=>`1px solid ${theme.vars.palette.neutral.softBg}`,
    },
  }, vstack({gap: 1.2}, [
    // blkBtn({
    //   icon: CircleRoundedIcon,
    //   iconProps: {sx: {opacity: 0}},
    // }, "Hello"),
    blkBtn({
      icon: mode === 'dark' ? LightModeRoundedIcon : DarkModeRoundedIcon,
      onClick: ()=>{
        if (mode === 'dark') {
          document.documentElement.removeAttribute('theme-mode');
          setMode('light');
          globalState.value.settings.darkMode = false;
        } else {
          document.documentElement.setAttribute('theme-mode', 'dark');
          setMode('dark');
          globalState.value.settings.darkMode = true;
        };
      },
    }, mode === 'dark' ? "Light mode" : "Dark mode"),
    blkBtn({
      icon: SettingsRoundedIcon,
    }, "Settings"),
    blkBtn({
      icon: GitHubIcon,
    }, "GitHub"),
  ]));




  const onClickSideListBtn=(idx)=>{
    const list = cloneDeep(globalStateSnap?.value?.chatLogs??[]);
    list.forEach(it=>{it.isActive=undefined;});
    console.log("hh");
    list[idx].isActive = true;
    globalState.value.currentChatKey = list[idx]?.['_key'];
    globalState.value.chatLogs = list;
  };



  const {
    topBarProps,
    topBarInnerProps,
    topBarChild,
    topBarChildren,

    sideBarProps,
    sideBarChild,
    sideBarChildren,

    containerProps,
    children: containerChildren,
    ...otherProps
  } = props;
  const { sx: topBarSX, ...topBarOtherProps } = topBarProps??{};
  const { sx: topBarInnerSX, ...topBarInnerOtherProps } = topBarInnerProps??{};
  const { sx: sideBarSX, ...sideBarOtherProps } = sideBarProps??{};
  const { sx: containerSX, ...containerOtherProps } = containerProps??{};

  const layout = vNode(null, null, [
    // TopBar
    myTopNavBar({
      component: 'nav',
      variant: 'plain', color: themeColor, invertedColors: true,
      maxWidthTransition: true, containerProps: { sx: {maxWidth: '100%',}, },
      ...topBarOtherProps,
      sx: {
        py: 1,
        zIndex: 200,
        position: 'fixed', top: 0, left: 0, right: 0,
        transform: (collapseTopNav||isUpMd) ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform 0.5s ease, background-color 0.5s ease, backdrop-filter 0.5s ease',
        backgroundColor: atTop ? undefined : theme=>theme.vars.palette.background.backdrop,
        backdropFilter: atTop ? undefined : 'blur(8px)',
        ...topBarSX,
      },
    }, [
      box({
        ...topBarInnerOtherProps,
        sx: {
          display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1,
          minWidth: 'min-content',
          ...topBarInnerSX,
        },
      }, [ leftChunk(), logoChunk(), rightChunk(), ]),
    ]),

    // SideBarBackDrop
    box({}, sheet({
      onClick: ()=>{closeSideBar();},
      sx: {
        zIndex: 210,
        pointerEvents: (openSideBar&&!isUpMd)?undefined:"none",
        position: 'fixed', top: 0, right: 0, bottom: 0, left: 0,
        backgroundColor: (openSideBar&&!isUpMd)?theme=>theme.vars.palette.background.backdrop:"transparent",
        backdropFilter: (openSideBar&&!isUpMd)?'blur(8px)':undefined,
        transition: 'transform 0.5s ease, background-color 0.5s ease, backdrop-filter 0.5s ease',
      },
    })),

    // SideBar
    sheet({
      // invertedColors: true,
      // color: 'neutral',
      // variant: 'soft',
      component: 'aside',
      sx: {
        boxShadow: (openSideBar&&!isUpMd) ? 'md' : undefined,
        opacity: (openSideBar||isUpMd) ? 1 : 0,
        // py: 1,
        // zIndex: isUpMd?180:220,
        zIndex: 220,
        // zIndex: 9999,
        position: 'fixed', top: 0, left: 0, bottom: 0,
        transform: (openSideBar||isUpMd) ? 'translateX(0%)' : 'translateX(-100%)',
        transition: [
          'opacity 0.5s ease',
          'transform 0.5s ease',
          'box-shadow 0.5s ease',
          'width 0.5s ease',
          'min-width 0.5s ease',
          'max-width 0.5s ease',
        ].join(", "),
        width: isUpMd ? `${sideWidth}px` : '60%',
        minWidth: `${sideWidth}px`,
        maxWidth: `${sideWidth*1.6}px`,
        ...sideBarSX,
      },
      ...sideBarOtherProps,
    }, [
      vstack({
        height: "100%",
      }, [
        sideBarTop(),
        sheet({
          sx: {
            flexGrow: 1,
            overflow: "auto",
            py: 1.2,
            px: 1.2,
          },
        }, [
          vstack({gap: 1.2,}, (globalStateSnap?.value?.chatLogs??[]).map((it, idx) => blkBtn({
            key: it?._key??`xx-${idx}`,
            icon: ChatBubbleOutlineRoundedIcon,
            isActive: it?.isActive,
            onClick: ()=>{
              onClickSideListBtn(idx);
            },
          }, it?.title??"(无题)"))),
        ]),
        sideBarBottom(),
      ]),
    ]),

    hstack({}, [
      box({
        sx: {
          width: `${isUpMd?sideWidth:0}px`,
          transition: 'width 0.5s ease',
        },
        height: `200px`,
        // border: "1px solid red",
        // background: '#fff',
        flexShrink: 0,
      }),
      container({
        maxWidthTransition: true,
        sx: {
          flexShrink: 1,
          border: "1px solid red",
          my: 3,
          ...containerSX,
        },
        ...containerOtherProps,
      }, [
        box({sx: {my: isUpMd?'5.6rem':'3.6rem'}}),
        containerChildren,
        // statusBarHolder(),
      ]),
    ]),



    // props?.children,
    // myPage(props?.pageProps, props?.children),

    // cornerTools(),

    // statusBar(),


  ]);

  return layout;
};

