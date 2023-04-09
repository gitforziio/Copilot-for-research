import vNode from '../lib/vue-to-react';
import { createContext, useContext, useRef } from 'react';
import {
  proxy,
  useSnapshot,
  ref,
  // subscribe,
} from 'valtio';
import * as valtio from 'valtio';
import { useProxy } from 'valtio/utils';
import * as valtio_utils from 'valtio/utils';

export function createValtioWrapper(myVal) {
  const myValProxy = proxy(myVal);
  return {
    val: myVal,
    proxy: myValProxy,

    get $proxy() {return useProxy(myValProxy);},
    get $snapshot() {return useSnapshot(myValProxy, { sync: true });},
    get $snapshot_sync() {return useSnapshot(myValProxy, { sync: true });},
    get $snapshot_not_sync() {return useSnapshot(myValProxy);},

    snapshot(options) {return useSnapshot(myValProxy, options);},

    subscribe(...args) {return valtio.subscribe(myValProxy, ...args);},

    get valtio() {return valtio;},
    get valtio_utils() {return valtio_utils;},
  };
};

export const valtio_ref = ref;

export default function createValtioContext(myVal) {
  const myContext = createContext();
  const myValProxy = proxy(myVal);
  const myContextProvider = ({ children }) => {
    const myValRef = useRef(myValProxy).current;
    return vNode(myContext.Provider, {
      value: myValRef,
    }, children);
  };
  return {
    provider: myContextProvider,

    proxy: myValProxy,
    get $proxy() {return useProxy(myValProxy);},

    context: myContext,
    get $context() {return useContext(myContext);},

    get $snapshot() {return useSnapshot(useContext(myContext), { sync: true });},
    get $snapshot_sync() {return useSnapshot(useContext(myContext), { sync: true });},
    get $snapshot_not_sync() {return useSnapshot(useContext(myContext));},

    snapshot(options) {return useSnapshot(myValProxy, options);},

    get valtio() {return valtio;},
    get valtio_utils() {return valtio_utils;},

    // useSnapshot(...args) {return useSnapshot(...args);},
    // useContext(...args) {return useContext(...args);},
    // subscribe(...args) {return subscribe(...args);},

    // get snapshot() {return useSnapshot(useContext(myContext), { sync: true });},
    // get use() {return useContext(myContext);},
    // get useContext() {return useContext(myContext);},
    // get useProxy() {return useProxy(myValProxy);},
  };
};

// const MyCounter = () => {
//   const state = useContext(MyContext)
//   const snap = useSnapshot(state)
//   return (
//     <>
//       {snap.count} <button onClick={() => ++state.count}>+1</button>
//     </>
//   )
// };
