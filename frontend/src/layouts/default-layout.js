import React, { useState, useContext, useEffect } from 'react';
import vNode from '../lib/vue-to-react';
import Lodash_debounce from 'lodash/debounce';

import {
  children,
  box, container, grid, stack,
  card, sheet,
  hstack, vstack,
  avatar, btn, iconBtn, ty,
  div, img, span, code, p,
  drawer,
  tooltip,
} from '../lib/v-dom-joy';

import { myPage, MyPage } from '../components/MyPage';
import { myTopNavBar, MyTopNavBar } from '../components/MyTopNavBar';

import ThemeContext from '../contexts/theme-context';

import { useColorScheme } from '@mui/joy/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

import { cornerTools } from './default-layout--corner-tools';
import { statusBar, statusBarHolder } from './default-layout--status-bar';
import { sideDrawer } from './default-layout--side-drawer';

import { useUserState } from '../api/user-hooks';

import { goTo } from '../api/urls';

export default function DefaultLayout(props) {
  const { mode, systemMode, setMode } = useColorScheme();
  const { userState, userReducers, dispatch } = useUserState();

  const themeContext = useContext(ThemeContext);

  const themeColor = 'neutral';
  // const themeColor = themeContext.color;

  const logo = [
    // iconBtn({size: 'sm',}, img({src: "/icon/UniAP-icon-bg-transparent.svg",})),
    avatar({
      size: 'sm',
      color: 'neutral',
      variant: 'soft',
      src: '/icon/UniA-icon-bg-transparent.svg',
      sx: {
        cursor: 'pointer',
      },
      onClick: ()=>{
        goTo('home');
        setTimeout(()=>{window.scrollTo({top: 0, behavior: 'smooth'});}, 10);
      },
    }),
    ty({
      level: 'h5',
      component: 'h1',
      fontWeight: 'lg',
      sx: {
        cursor: 'pointer',
      },
      onClick: ()=>{
        goTo('home');
        setTimeout(()=>{window.scrollTo({top: 0, behavior: 'smooth'});}, 10);
      },
    }, 'UniA'),
  ];



  const userAvatar = ()=> !userState?.loggedIn ? null : tooltip({
    title: `${userState?.username}`,
    arrow: true,
    variant: 'outlined',
  }, avatar({
    size: 'sm',
    color: 'neutral',
    variant: 'soft',
    sx: {
      cursor: 'pointer',
    },
  }, userState?.username?.[0]?.toUpperCase?.()));






  const [openMenu, set_openMenu] = useState(false);
  const menuBtn = ()=>children({key: 'menu'}, iconBtn({
    color: 'neutral',
    variant: 'plain',
    onClick: ()=>{
      set_openMenu(!openMenu);
    },
  }, vNode(MenuRoundedIcon)), sideDrawer({
    open: openMenu,
    onClose: ()=>{set_openMenu(false);},
  }));

  const rightChunk = () => hstack({
    // spacing: 1,
    sx: {
      ml: 'auto',
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      // flexGrow: 1,
      minWidth: 'min-content',
    },
  }, [
    userAvatar(),
    menuBtn(),
  ]);



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







  const { topBarProps, topBarInnerProps, topBarChild, containerProps, children: containerChildren, ...otherProps } = props;
  const { sx: topBarSX, ...topBarOtherProps } = topBarProps??{};
  const { sx: topBarInnerSX, ...topBarInnerOtherProps } = topBarInnerProps??{};
  const { sx: containerSX, ...containerOtherProps } = containerProps??{};

  const layout = vNode(null, null, [
    myTopNavBar({
      component: 'nav',
      // variant: ({"light": "solid", "dark": "soft"})?.[mode],
      variant: 'plain',
      color: themeColor,
      invertedColors: true,
      maxWidthTransition: true,
      ...topBarOtherProps,
      sx: {
        py: 1,
        position: 'fixed',
        top: '0',
        left: 0,
        right: 0,
        zIndex: 200,
        transform: collapseTopNav ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform 0.5s ease, background-color 0.5s ease, backdrop-filter 0.5s ease',

        backgroundColor: atTop ? undefined : theme=>theme.vars.palette.background.backdrop,
        backdropFilter: atTop ? undefined : 'blur(8px)',

        ...topBarSX,
      },
    }, [

      box({
        ...topBarInnerOtherProps,
        sx: {
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexGrow: 1,
          minWidth: 'min-content',
          ...topBarInnerSX,
        },
      }, [
        logo,
        topBarChild,
        rightChunk(),
      ]),

    ]),


    container({
      maxWidthTransition: true,
      sx: {
        my: 3,
        // px: {
        //   xs: "0",
        //   // xs: "16px",
        //   sm: "24px",
        // },
        ...containerSX,
      },
      ...containerOtherProps,
    }, [
      box({sx: {my: '5.6rem'}}),
      containerChildren,
      statusBarHolder(),
    ]),


    // props?.children,
    // myPage(props?.pageProps, props?.children),
    cornerTools(),
    // statusBar(),


  ]);

  return layout;
};

