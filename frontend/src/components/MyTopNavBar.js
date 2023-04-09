import vNode from '../lib/vue-to-react';
import {
  box, container, grid, stack,
  card, sheet,
  hstack, vstack,
  avatar, btn, iconBtn,
  div, img, span, code, p, ty,
} from '../lib/v-dom-joy';

export function MyTopNavBar(props) {
  return sheet({
    component: 'nav',
    variant: props?.variant,
    color: props?.color,
    invertedColors: props?.invertedColors,
    sx: props?.sx,
    ...(props?.sheetProps ?? {}),
  }, [
    container({
      maxWidthTransition: props?.maxWidthTransition,
      ...(props?.containerProps ?? {}),
    }, props?.children),
  ]);
};

export function myTopNavBar(props, ...children) {return vNode(MyTopNavBar, props, ...children);};

export default MyTopNavBar;
