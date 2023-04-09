import React, { useRef, useState, useEffect, Fragment } from 'react';
import vNode from './vue-to-react';

const _vNode = () => vNode('span', {}, 'xx');

export function children(props, ...children) {return vNode(null, props, ...children);};
export function fragment(props, ...children) {return vNode(Fragment, props, ...children);};
export function frag(props, ...children) {return vNode(Fragment, props, ...children);};
export function dotChildren(...children) {return vNode(null, null, ...children);};
export function div(props, ...children) {return vNode('div', props, ...children);};
export function img(props, ...children) {return vNode('img', props, ...children);};

import Divider from '@mui/joy/Divider';
export function divider(props, ...children) {return vNode(Divider, props, ...children);};

import Ratio from '@mui/joy/AspectRatio';
export function ratio(props, ...children) {return vNode(Ratio, props, ...children);};

import Avatar from '@mui/joy/Avatar';
export function avatar(props, ...children) {return vNode(Avatar, props, ...children);};

import Box from '@mui/system/Box';
export function box(props, ...children) {return vNode(Box, props, ...children);};

import Container from '@mui/system/Container';
export function container(props, ...children) {
  const {sx: theSX, maxWidthTransition, ...otherProps} = props;
  const {maxWidth: theMaxWidth, ...otherSX} = theSX??{};
  const sx = {
    maxWidth: theMaxWidth??{
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
      xl: '1360px',
    },
    ...otherSX,
  };
  if (maxWidthTransition) {
    const time = typeof(maxWidthTransition)!='number' ? 250 : (+ maxWidthTransition);
    sx.transition = `max-width ${0.001*time}s`;
    // const omit = (prop, { [prop]: xx, ...rest }) => rest;
    // props = omit('maxWidthTransition', props);
  };
  return vNode(Container, { ...otherProps, sx: sx, }, ...children);
};

import Grid from '@mui/joy/Grid';
export function grid(props, ...children) {return vNode(Grid, props, ...children);};
import Stack from '@mui/joy/Stack';
export function stack(props, ...children) {return vNode(Stack, props, ...children);};
export function hstack(props, ...children) {return vNode(Stack, {...props, direction: 'row'}, ...children);};
export function vstack(props, ...children) {return vNode(Stack, {...props, direction: 'column'}, ...children);};
export function myHstack(props, ...children) {return vNode(Stack, {
  direction: 'row',
  gap: 1,
  alignItems: 'center',
  flexWrap: 'wrap',
  ...props,
}, ...children);};

import Card from '@mui/joy/Card';
export function card(props, ...children) {return vNode(Card, props, ...children);};
export function smOutlinedCard(props, ...children) {return vNode(Card, {variant: 'outlined', size: 'sm', ...props}, ...children);};
import Sheet from '@mui/joy/Sheet';
export function sheet(props, ...children) {return vNode(Sheet, props, ...children);};

import IconBtn from '@mui/joy/IconButton';
export function iconBtn(props, ...children) {return vNode(IconBtn, props, ...children);};
export function smIconBtn(props, ...children) {return vNode(IconBtn, {size: 'sm', ...props}, ...children);};
import Btn from '@mui/joy/Button';
export function btn(props, ...children) {return vNode(Btn, props, ...children);};
export function smBtn(props, ...children) {return vNode(Btn, {size: 'sm', ...props}, ...children);};

export function BlockButton(props) {

  const {
    sx: btnSX,
    icon,
    iconProps,
    children,
    isActive,
    ...otherProps
  } = props;
  const {
    sx: iconSX,
    ...otherIconProps
  } = iconProps??{};

  const bbSX = ((theme) => ({...theme.typography.body3, color: theme.vars.palette.neutral.plainColor, justifyContent: 'start', ...btnSX}));
  const btnStartDecoratorSX = ({fontSize: 'sm', ...iconSX});

  return btn({
    sx: bbSX,
    size: 'sm', variant: isActive ? 'soft' : 'plain', color: 'neutral',
    startDecorator: vNode(icon, {sx: btnStartDecoratorSX, ...otherIconProps}),
    ...otherProps,
  }, children);
};
export function blkBtn(props, ...children) {return vNode(BlockButton, props, ...children);};


import Chip from '@mui/joy/Chip';
export function chip(props, ...children) {return vNode(Chip, props, ...children);};
import Ty from '@mui/joy/Typography';
export function ty(props, ...children) {return vNode(Ty, props, ...children);};
export function span(props, ...children) {return vNode(Ty, {component: 'span', ...props}, ...children);};
export function code(props, ...children) {return vNode(Ty, {component: 'code', ...props}, ...children);};
export function p(props, ...children) {return vNode(Ty, {component: 'p', ...props}, ...children);};

import Tooltip from '@mui/joy/Tooltip';
export function tooltip(props, ...children) {
  const {sx: theSX, ...otherProps} = (props??{});
  return vNode(Tooltip, {sx: {maxWidth: '30em', ...theSX}, arrow: true, ...otherProps}, ...children);
};

export function ToolButton(props) {
  const { useIcon, title, tooltipProps, buttonProps, ...otherProps } = props;
  const btnFn = useIcon ? iconBtn : btn;
  return tooltip({
    // variant: "outlined", color: "neutral",
    arrow: true,
    title,
    ...tooltipProps,
  }, btnFn({
    size: 'sm', variant: 'outlined', color: 'neutral',
    ...buttonProps,
    ...otherProps,
  }, props.children));
};
export function toolBtn(props, ...children) {return vNode(ToolButton, props, ...children);};

import PopperUnstyled from '@mui/base/PopperUnstyled';
export function basePopper(props, ...children) {return vNode(PopperUnstyled, props, ...children);};
export function PopCard(props){
  const { placement, onEnter, onExit, children, ...cardProps } = props;
  return vNode(PopperUnstyled, {placement, onEnter, onExit}, card(cardProps, children));
};
export function popCard(props, ...children) {return vNode(PopCard, props, ...children);};

import Slider from '@mui/joy/Slider';
export function slider(props, ...children) {return vNode(Slider, props, ...children);};

import Switch from '@mui/joy/Switch';
export function switchBox(props, ...children) {return vNode(Switch, props, ...children);};

import RadioGroup from '@mui/joy/RadioGroup';
export function radioGroup(props, ...children) {return vNode(RadioGroup, props, ...children);};
import Radio from '@mui/joy/Radio';
export function radio(props, ...children) {return vNode(Radio, props, ...children);};

import ClickAwayListener from '@mui/base/ClickAwayListener';
export function clickAway(props, ...children) {return vNode(ClickAwayListener, props, ...children);};

import Menu from '@mui/joy/Menu';
export function menu(props, ...children) {return vNode(Menu, props, ...children);};
import MenuItem from '@mui/joy/MenuItem';
export function menuItem(props, ...children) {return vNode(MenuItem, props, ...children);};

function makeSomeButtonOfMenu(cpFn=btn) {
  return function ButtonOfMenu(props) {
    const [menuAnchorEl, set_menuAnchorEl] = useState(null);
    const menuOpened = Boolean(menuAnchorEl);

    const idPrefix = props.idPrefix;
    const btnId = idPrefix==null ? undefined : `${idPrefix}-button`;
    const menuId = idPrefix==null ? undefined : `${idPrefix}-menu`;

    return clickAway({
      onClickAway: ()=>{
        set_menuAnchorEl(null);
      },
    }, div({}, [
      tooltip(props?.tooltipProps, cpFn({
        // size: "sm", color: "neutral", variant: "outlined",
        id: btnId,
        'aria-controls': menuOpened ? menuId : undefined,
        'aria-haspopup': 'true',
        'aria-expanded': menuOpened ? 'true' : undefined,
        onClick: (event)=>{
          set_menuAnchorEl(menuAnchorEl==null ? event.currentTarget : null);
          props?.onClickButton?.(event);
          props?.onClick?.(event);
        },
        ...props?.buttonProps,
      }, props?.buttonContent)),
      menu({
        open: props?.open==null ? menuOpened : props?.open,
        id: menuId,
        anchorEl: menuAnchorEl,
        'aria-labelledby': btnId,
        // placement: "bottom-end",
        onClose: (event)=>{
          set_menuAnchorEl(null);
          props?.onCloseMenu?.(event);
          props?.onClose?.(event);
        },
        ...props?.menuProps,
      }, props?.menuContent),
    ]));
  };
}

export const ButtonOfMenu = makeSomeButtonOfMenu(btn);
export const IconButtonOfMenu = makeSomeButtonOfMenu(iconBtn);
export function btnOfMenu(props, ...children) {return vNode(ButtonOfMenu, props, ...children);};
export function iconBtnOfMenu(props, ...children) {return vNode(IconButtonOfMenu, props, ...children);};



import CardOverflow from '@mui/joy/CardOverflow';
export function overflow(props, ...children) {return vNode(CardOverflow, props, ...children);};
import CardCover from '@mui/joy/CardCover';
export function cover(props, ...children) {return vNode(CardCover, props, ...children);};
import CardContent from '@mui/joy/CardContent';
export function content(props, ...children) {return vNode(CardContent, props, ...children);};


// import MuiWrapper from '../components/MaterialUIContextWrapper';
// import JoyWrapper from '../components/JoyUIContextWrapper';
import Collapse from '@mui/material/Collapse';
export function collapse(props, ...children) {return vNode(Collapse, props, ...children);};
// export function collapse(props, ...children) {
//   return vNode(MuiWrapper, {}, vNode(Collapse, props, vNode(JoyWrapper, {}, ...children)));
// };

import Drawer from '@mui/material/Drawer';
export function drawer(props, ...children) {
  return vNode(Drawer, props, ...children);
  // return vNode(MuiWrapper, {injectFirst:true}, vNode(Drawer, props, /*vNode(JoyWrapper, {}, ...children)*/));
};

// const InnerJoySheet = React.forwardRef((props_, ref)=>vNode(JoyWrapper, {}, sheet({ref: ref}, ...props_?.children)));

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
export function tabs(props, ...children) {return vNode(Tabs, props, ...children);};
export function tabList(props, ...children) {return vNode(TabList, props, ...children);};
export function tab(props, ...children) {return vNode(Tab, props, ...children);};
export function tabPanel(props, ...children) {return vNode(TabPanel, props, ...children);};

import Input from '@mui/joy/Input';
export function input(props, ...children) {return vNode(Input, props, ...children);};

import Textarea from '@mui/joy/Textarea';
export function textarea(props, ...children) {return vNode(Textarea, props, ...children);};


import Select from '@mui/joy/Select';
export function select(props, ...children) {return vNode(Select, props, ...children);};
import Option from '@mui/joy/Option';
export function option(props, ...children) {return vNode(Option, props, ...children);};
// import Option, { optionClasses } from '@mui/joy/Option';
// import List from '@mui/joy/List';
// import ListItemDecorator, {
//   listItemDecoratorClasses,
// } from '@mui/joy/ListItemDecorator';
// import ListDivider from '@mui/joy/ListDivider';
// import ListItem from '@mui/joy/ListItem';
// import Check from '@mui/icons-material/Check';

import Autocomplete from '@mui/joy/Autocomplete';
export function autocomplete(props, ...children) {return vNode(Autocomplete, props, ...children);};

import Modal from '@mui/joy/Modal';
export function modal(props, ...children) {return vNode(Modal, props, ...children);};
import ModalDialog from '@mui/joy/ModalDialog';
export function modalDialog(props, ...children) {return vNode(ModalDialog, props, ...children);};
import ModalClose from '@mui/joy/ModalClose';
export function modalClose(props, ...children) {return vNode(ModalClose, props, ...children);};
