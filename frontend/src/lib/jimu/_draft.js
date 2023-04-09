import vNode from "../vue-to-react";







function interfaceBinding(self, {fn, inputs, outputs}) {
  //
  // self.
};






function get_settings() {};
function save_settings() {};





class JimuUnitFactory {
  constructor(master, name, component) {
    this.master = master;
    this.name = name;
    this.component = component;
    this.childInfo = {
      name,
      component,
      args: null,
      eventFns: {},
    };
    this.value = undefined;
    this.valueUpdateTarget = undefined;
  }
  func(...args) {
    this.childInfo.args = args;
    if (this.master.currentNode==null) {
      throw `${this.name}: this.master.currentNode==null`;
    };
    this.childInfo.__parent = this.master.currentNode;
    this.master.addChildToCurrentNode(this.childInfo);
    return this;
  }
  have(func) {
    this.master.currentNode = this.childInfo;
    func(this.master.dict);
    this.master.currentNode = this.childInfo.__parent;
    return this;
  }

  bindEvent(eventName, eventPropName, {fn, inputs, outputs}) {
    this[eventName] = ({fn, inputs, outputs}) => {
      const inputs_ = inputs.map(it=>((typeof it)==="string") ? this.master.dict[it] : it);
      const inputs_values = inputs_.map(it=>it.value);

      const outputs_ = outputs.map(it=>((typeof it)==="string") ? this.master.dict[it] : it);

      this.eventFns[eventPropName]=async()=>{
        const output_values = await fn(inputs_values);
        for (let ii in outputs_) {
          const target = outputs_[ii]?.valueUpdateTarget;
          if (target!=null) {
            target.value = output_values[ii];
          };
        };
      };
    };
  }

}


function treeNodeToVirtualNode(treeNode, idx=0) {
  return vNode(treeNode.component, {
    key: `[${idx}][${treeNode?.name}][${treeNode?.args?.elem_id}]`,
    ...treeNode?.args,
  }, (treeNode?.children??[]).map((child, c_idx)=>treeNodeToVirtualNode(child, c_idx)));
};

class Jimu {
  constructor() {
    // this.state = {};
    this.tree = {
      children: [],
    };
    this.currentNode = this.tree;
    this.dict = {};
    // this.Tab = (new this.__factory("Tab", TabComponent)).func;
    this.stateTree = {};
  }
  createRoot() {}
  addChildToCurrentNode(child) {
    if (this.currentNode.children==null) {this.currentNode.children=[];}
    this.currentNode.children.push(child);
  }
  generateComponent() {
    const theComponent = function(props) {
      return vNode(this.tree);
    };
  }
}



function draft(jimu) {
  const demo = jimu.Blocks({title: "ChatGPT", css: ""}).have((dict)=>{

    dict['global_state'] = jimu.State({value: {}});

    jimu.Tab("ChatGPT").have((dict)=>{

      jimu.Row().have((dict)=>{
        jimu.Column({scale: 10}).have(()=>{
          jimu.Markdown("Go to https://platform.openai.com/account/api-keys to get your API key.");
          dict['api_key_text'] = jimu.Textbox({label: "Your API key", elem_id: "api-key-textbox"});
        });
      });

      jimu.Row().have((dict)=>{
        jimu.Column(scale=2).have((dict)=>{
          dict['api_key_refresh_btn'] = jimu.Button("🔄");
          dict['api_key_refresh_btn'].click({fn: get_settings, inputs:['global_state'], outputs:['global_state', 'api_key_text']});
        });

        jimu.Column(scale=2).have((dict)=>{
          dict['api_key_save_btn'] = jimu.Button("💾");
          dict['api_key_save_btn'].click({fn: save_settings, inputs:['global_state', 'api_key_text'], outputs:['global_state', 'api_key_text']});
        });
      });

      jimu.Row().have((dict)=>{});

    });
  });
};



const example_tree = {
  unit: "Blocks", args: {title: "ChatGPT", css: ""},
  inner: [
    { unit: "State", nameInDict: "global_state", },
    { unit: "Tab", args: {label: "ChatGPT"},
      inner: [
        { unit: "Row",
          inner: [
            { unit: "Column", args: {scale: 10},
              inner: [
                { unit: "Markdown", value: "Go to https://platform.openai.com/account/api-keys to get your API key.", },
                { unit: "Textbox", args: {label: "Your API key", elem_id: "api-key-textbox"},
                  nameInDict: "api_key_text", }, ], }, ], },
        { unit: "Row",
          inner: [
            { unit: "Column", args: {scale: 2},
              inner: [
                { unit: "Button", value: "🔄",
                  nameInDict: "api_key_refresh_btn",
                  events: [
                    { event: "click",
                      fn: get_settings,
                      inputs:['global_state'],
                      outputs:['global_state', 'api_key_text'], }, ], }, ], },
            { unit: "Column", args: {scale: 2},
              inner: [
                { unit: "Button", value: "💾",
                  nameInDict: "api_key_save_btn",
                  events: [
                    { event: "click",
                      fn: save_settings,
                      inputs:['global_state', 'api_key_text'],
                      outputs:['global_state', 'api_key_text'], }, ], }, ], }, ], }, ], }, ], };



