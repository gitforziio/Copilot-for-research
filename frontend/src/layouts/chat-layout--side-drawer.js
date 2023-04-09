import React, { useState, useContext, useEffect } from 'react';
import vNode from '../lib/vue-to-react';

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

import ThemeContext from '../contexts/theme-context';

import { useColorScheme } from '@mui/joy/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


import GlobalStateManagerValtio from '../contexts/global-state';



export function SideDrawer(props) {
  const globalState = GlobalStateManagerValtio.proxy;

  const { mode, systemMode, setMode } = useColorScheme();
  const content = () => container({
    sx: {my: 2,},
  }, [
    iconBtn({
      variant: 'plain',
      onClick: props?.onClose,
    }, vNode(CloseRoundedIcon)),
    btn({
      variant: 'outlined',
      onClick: ()=>{
        if (mode === 'dark') {
          document.documentElement.removeAttribute('theme-mode');
          setMode('light');
        } else {
          document.documentElement.setAttribute('theme-mode', 'dark');
          setMode('dark');
        };
      },
    }, vNode(mode === 'dark' ? LightModeRoundedIcon : DarkModeRoundedIcon)),
  ]);

  return drawer({
    anchor: 'left',
    open: props?.open,
    onClose: props?.onClose,
    ModalProps: {
      keepMounted: true, // Better open performance on mobile.
    },
    // variant: 'permanent',
  }, sheet({
    sx: {
      // display: { xs: 'block', sm: 'none' },
      minWidth: '300px',
      maxWidth: '400px',
      width: '50vw',
      height: '100%',
    },
  }, content()));
};
export default SideDrawer;
export function sideDrawer(props, ...children) {return vNode(SideDrawer, props, ...children);};

