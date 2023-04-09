import vNode from '../lib/vue-to-react';
import {
  box, container, grid, stack,
  card, sheet,
  hstack, vstack,
  avatar, btn, iconBtn,
  div, img, span, code, p, ty,
} from '../lib/v-dom-joy';

// export function MyPage(props) {
//   return container({
//     maxWidthTransition: true,
//     sx: {
//       my: 3,
//       // px: {
//       //   xs: "0",
//       //   // xs: "16px",
//       //   sm: "24px",
//       // },
//     },
//     ...props?.containerProps,
//   }, card({
//     sx: {
//       // "--Card-radius": {
//       //   xs: "2px",
//       //   sm: "8px",
//       // },
//     },
//     ...props?.cardProps,
//   }, props?.children));
// };

export function MyPage(props) {
  return card({
    ...props,
    sx: {
      // "--Card-radius": {
      //   xs: "2px",
      //   sm: "8px",
      // },
      // "--Card-radius": "8px",
      my: '1.5rem',
      overflowX: 'hidden',
      ...props?.sx,
    },
  }, props?.children);
};

export function myPage(props, ...children) {return vNode(MyPage, props, ...children);};

export default MyPage;
