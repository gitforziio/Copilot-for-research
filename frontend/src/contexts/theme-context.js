import React from 'react';
import { deepmerge } from '@mui/utils';
import { extendTheme as extendJoyTheme } from '@mui/joy/styles';
import { experimental_extendTheme as extendMuiTheme } from '@mui/material/styles';
import { mergedTheme } from '../lib/merged-ui';

const themeJoyMain = extendJoyTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: '#EBEBEF',
        },
      },
    },
  },
});

const themeJoyMerged = deepmerge(mergedTheme, themeJoyMain);

const themeDB = {
  currentTheme: 'merged',
  themeMode: 'light',
  themeColor: 'primary',
  themeVariant: 'soft',
  themes: {
    main: {
      material: extendMuiTheme({}),
      joy: themeJoyMain,
    },
    merged: {
      material: extendMuiTheme({}),
      joy: themeJoyMerged,
    },
  },
  get theme() {
    return this.themes?.[this?.currentTheme] ?? this.themes.main;
  },
  get mode() {
    return this.themeMode;
  },
  set mode(name) {
    this.themeMode = name;
  },
  get color() {
    return this.themeColor;
  },
  set color(name) {
    this.themeColor = name;
  },
  get variant() {
    return this.themeVariant;
  },
  set variant(name) {
    this.themeVariant = name;
  },
  themeFor(ui='joy') {
    return this.theme?.[ui];
  },
  switchTheme(name='main') {
    this.currentTheme = name;
  },
  switchColor(name='neutral') {
    this.themeColor = name;
  },
  switchVariant(name='soft') {
    this.themeVariant = name;
  },
  addTheme(name='myTheme', theTheme={}) {
    this.themes[name] = theTheme;
  },
};

const ThemeContext = React.createContext(themeDB);
export default ThemeContext;
