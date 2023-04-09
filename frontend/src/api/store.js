import localforage from 'localforage';

const store = localforage.createInstance({
  name: "Copilot-for-research--store"
});

export default store;

