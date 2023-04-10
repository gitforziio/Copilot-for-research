import React, { useState, useContext, useEffect, useRef } from 'react';
import vNode from '../lib/vue-to-react';

import { sortBy } from 'lodash';

import CircularProgress from '@mui/joy/CircularProgress';

import {
  children,
  box, container, grid, stack,
  card, sheet,
  smOutlinedCard,
  hstack, vstack,
  tabs, tabList, tab, tabPanel,
  avatar, btn, iconBtn, ty,
  div, img, span, code, p,
  drawer,
  tooltip,
  modal,
  toolBtn,
  blkBtn,
} from '../lib/v-dom-joy';

import { backendApi } from '../api/backend';


function NoteCard(props) {
  const {
    note,
  } = props;
  return smOutlinedCard({}, [
    note?.comment?.length ? ty({
      component: "p",
    }, note?.comment) : null,
    note?.reference_text?.length ? ty({
      component: "p",
    }, note?.reference_text) : null,
  ]);
};


export default function NotesPanel(props) {
  const {
    // notes,
    topic,
  } = props;

  const [loading, set_loading] = useState(true);

  const [notes, set_notes] = useState([]);

  const loadedOnce = useRef(null);
  useEffect(()=>{
    const fn = async()=>{
      if (loadedOnce.current) {return;};
      loadedOnce.current = true;
      const resp = await backendApi.getTopicNotes(topic?.topic_id);
      console.log(resp);
      const got_notes = sortBy(resp?.data??[], "last_modified_ts");
      console.log(got_notes);
      set_notes(got_notes);
      set_loading(false);
    };
    fn();
  }, []);

  // backendApi

  return sheet({
    sx: {
      height: "100%",
      py: 1,
      overflow: "auto",
    },
  }, vstack({
    gap: 1,
  }, loading ? [
    sheet({
    }, vNode(CircularProgress, {
      variant: "soft",
      sx: {
        display: "flex",
        mx: "auto",
        mt: "2em",
      },
    })),
  ] : notes.map((note, idx)=>vNode(NoteCard, {note, key: `note-${idx}`}))));
};
