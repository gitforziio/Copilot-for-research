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
} from '../lib/v-dom-joy';

// import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
// import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
// import StraightRoundedIcon from '@mui/icons-material/StraightRounded';

export function StatusBar(props) {
  return sheet({
    invertedColors: true,
    size: 'sm',
    color: 'nuetral',
    variant: 'soft',
    sx: {
      position: 'fixed',
      left: `${0}px`,
      right: `${0}px`,
      bottom: `${0}px`,
    },
  }, [
    iconBtn({}, vNode(KeyboardArrowUpRoundedIcon)),
  ]);
};
export default StatusBar;
export function statusBar(props, ...children) {return vNode(StatusBar, props, ...children);};


export function StatusBarHolder(props) {
  return box({
    sx: {
      my: '5rem',
    },
  }, []);
};
export function statusBarHolder(props, ...children) {return vNode(StatusBarHolder, props, ...children);};

