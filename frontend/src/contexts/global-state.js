import createValtioContext, { createValtioWrapper } from '../lib/create-valtio-context';

class GlobalStateManager {
  constructor() {
    this.value = {
      // chatLogs: [
      // ],
      // settings: {},
      currentTabIsHome: true,
      currentTab: 0,
      currentTopic: null,
      currentConversations: [],
      currentTags: [],
      currentNotes: [],
      allTopics: [],
      allTopicsLoading: true,
      openedPanels: [],
      //
    }
  }
}

export const GlobalStateManagerValtio = createValtioContext(new GlobalStateManager());
// export const GlobalStateManagerValtio = createValtioWrapper({value: {}});
export default GlobalStateManagerValtio;
