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
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
// import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
// import StraightRoundedIcon from '@mui/icons-material/StraightRounded';

export function CornerTools(props) {
  return box({
    sx: {
      position: 'fixed',
      right: `${16+4}px`,
      bottom: `${64-24}px`,
      zIndex: 100,
    },
    onClick: ()=>{window.scrollTo({top: 0, behavior: 'smooth'});},
  }, vstack({gap:1}, [
    iconBtn({
      variant: 'soft', color: 'neutral', sx: {
        backgroundColor: theme=>theme.vars.palette.background.backdrop,
        backdropFilter: 'blur(8px)',
      },
    }, vNode(KeyboardArrowUpRoundedIcon)),
    iconBtn({
      variant: 'soft', color: 'neutral', sx: {
        backgroundColor: theme=>theme.vars.palette.background.backdrop,
        backdropFilter: 'blur(8px)',
      },
    }, vNode(KeyboardArrowDownRoundedIcon)),
  ]));
};
export default CornerTools;
export function cornerTools(props, ...children) {return vNode(CornerTools, props, ...children);};
