import React, { createElement, Fragment } from 'react';
import classNames from 'classnames';
import Lodash_flattenDeep from 'lodash/flattenDeep';

// function isReactElement(obj) {
//   return obj.$$typeof === Symbol.for("react.element") && obj.hasOwnProperty("type") && obj.hasOwnProperty("props");
// };

export function makeClassNames(vueClass) {
  // if (Array.isArray(vueClass)) {
  //   const vueClasses = vueClass.map(it=>makeClassNames(it));
  //   return classNames(...vueClasses);
  // };
  return classNames(vueClass);
};

export default function vNode(tag, props, ...children) {
  if (tag==null) {tag = Fragment;};
  if (props?.class!=null) {
    props.className = makeClassNames(props.class);
    const omit = (prop, { [prop]: xx, ...rest }) => rest;
    props = omit('class', props);
  };
  children = Lodash_flattenDeep([children]);
  return createElement(tag, props, ...children);
};
