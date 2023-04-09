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

export function TopNavBar(props) {
  return sheet({
    invertedColors: true,
    size: 'sm',
    color: 'neutral',
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
export default TopNavBar;
export function topNavBar(props, ...children) {return vNode(TopNavBar, props, ...children);};


export function TopNavBarHolder(props) {
  return box({
    sx: {
      my: '5rem',
    },
  }, []);
};
export function topNavBarHolder(props, ...children) {return vNode(TopNavBarHolder, props, ...children);};

