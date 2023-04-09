import { useEffect, useState } from 'react';
import vNode from './lib/vue-to-react';
import JoyUIContextWrapper from './components/JoyUIContextWrapper';
// import reactLogo from './assets/react.svg';
// import './App.css';
import Root from './pages/root/root';

import GlobalStateManagerValtio from './contexts/global-state';
import store from './api/store';

import { merge, cloneDeep } from 'lodash';

function AppCore() {
  return vNode('div', {className: 'app', id: 'app'}, vNode(Root));
};

function App() {

  // const globalState = GlobalStateManagerValtio.proxy;

  // useEffect(()=>{
  //   const unsubscribe_globalState = GlobalStateManagerValtio.subscribe(()=>{
  //     console.log('globalState changed:\n', cloneDeep(globalState.value));
  //     store.setItem('globalState', cloneDeep(globalState.value));
  //   });

  //   const effect_fn = async()=>{
  //     const storedGlobalState = await store.getItem('globalState') ?? {};
  //     Object.assign(globalState.value, merge(cloneDeep(globalState.value), storedGlobalState));
  //     // console.log(cloneDeep(globalState.value));
  //   };
  //   effect_fn();

  //   return (()=>{unsubscribe_globalState();});
  // }, []);

  const coreNode = vNode(AppCore);
  const wrappers = [
    {
      component: JoyUIContextWrapper,
      props: {
        injectFirst: true,
        useCssBaseline: true,
        defaultMode: 'light',
        // colorSchemeSelector: "#app *, .app *",
        // disableNestedContext: true,
      },
    },
    {
      component: GlobalStateManagerValtio.provider,
      props: {},
    },
  ];

  let finalNode = coreNode;
  for (const wrapper of wrappers) {
    finalNode = vNode(wrapper.component, wrapper.props, finalNode);
  };
  return finalNode;
};

export default App;
