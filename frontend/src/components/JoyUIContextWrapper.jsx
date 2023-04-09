import {
  // createElement as vNode,
  useContext,
} from "react";
import vNode from '../lib/vue-to-react';
import ThemeContext from '../contexts/theme-context';

import {
  StyledEngineProvider,
  CssVarsProvider,
  // extendTheme,
} from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';

export default function Wrapper(props) {
  const themeContext = useContext(ThemeContext);
  const globalTheme = props?.theme ?? (themeContext?.themeFor?.('joy'));
  const defaultMode = props?.defaultMode ?? themeContext?.mode ?? 'light';
  return vNode(StyledEngineProvider, {injectFirst: props?.injectFirst},
    vNode(CssVarsProvider, {
      defaultMode: defaultMode,
      // the props below are specific to this demo,
      // you might not need them in your app.
      //
      theme: globalTheme,
      // the selector to apply CSS theme variables stylesheet.
      colorSchemeSelector: props?.colorSchemeSelector,
      // the local storage key to use
      modeStorageKey: "my-app-mode",
      // set as root provider
      disableNestedContext: props?.disableNestedContext,
    },
      props?.useCssBaseline ? vNode(CssBaseline) : null,
      props?.children,
    ),
  );
};
