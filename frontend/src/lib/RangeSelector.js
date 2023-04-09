
import {range as Lodash_range} from 'lodash';

const rangeToIndices = (aa, bb) => {
  return Lodash_range(aa, bb);
  // const [small, large] = Lodash_sortBy([aa, bb]);
  // return Lodash_range(small, large);
};


export default class RangeSelector {
  constructor() {
    this.state = {
      selecting: false,
      done: false,
      from: null,
      to: null,
      current: [null, null],
      selectingIdxes: [],
      // selectingIdxDict: {},
    };
    this.toolbarState = {
      visible: false,
      atIdx: null,
      isAtPosition: null,
    };
  };

  // updateSelectingIdxDict() {
  //   this.state.selectingIdxDict = Object.fromEntries(this.state.selectingIdxes.map(it=>[it, true]));
  // };

  closeToolBar() {
    this.toolbarState = {
      visible: false,
      atIdx: null,
      isAtPosition: null,
    };
    this.clear();
  };

  setVisibility(val) {
    this.toolbarState.visible = Boolean(val);
  };
  setAtIdx(val) {
    this.toolbarState.atIdx = val;
  };
  setIsAtPosition(val) {
    this.toolbarState.isAtPosition = Boolean(val);
  };

  judgeSelecting(idx, isPosition) {
    return !isPosition ? (this.state?.selectingIdxes?.includes?.(idx+1)&&this.state?.selectingIdxes?.includes?.(idx)) : (this.state?.selectingIdxes?.includes?.(idx+1));
  };
  judgeSelected(idx, isPosition) {
    if (!isPosition) {return this.state?.from <= idx && this.state?.to >= idx+1;};
    return this.state?.from <= idx+1 && this.state?.to >= idx+1;
  };
  makeSelectionType(idx, isPosition) {
    return this.judgeSelected(idx, isPosition) ? 'selected' : this.judgeSelecting(idx, isPosition) ? 'selecting' : '';
  }

  clear() {
    this.state = {
      selecting: false,
      done: false,
      from: null,
      to: null,
      current: [null, null],
      selectingIdxes: [],
      selectingIdxDict: {},
    };
  };

  onMouseDown(idx, isPosition) {
    idx = isPosition ? +idx+1 : +idx;
    // 按第一处
    if (!this.state.selecting) {
      // 设置为起点
      Object.assign(this.state, {
        from: idx,
        current: [idx, isPosition ? idx : (idx+1)],
        to: isPosition ? idx : (idx+1),
        done: false,
        selecting: true,
        selectingIdxes: isPosition ? [idx] : [idx, idx+1],
      });
      // this.updateSelectingIdxDict();
      return this.state;
    };
    // 按第二处
    if (this.state.selecting && this.state.from!=null && this.state.from!=this.state.current) {
      if (this.state.to!=null && this.state.to>idx) {
        Object.assign(this.state, {
          from: idx,
          to: this.state.to,
          current: [idx, isPosition ? idx : (idx+1)],
          done: true,
          selecting: false,
          selectingIdxes: rangeToIndices(idx, this.state.to+1),
        });
        // this.updateSelectingIdxDict();
        return this.state;
      };
      // else
      Object.assign(this.state, {
        from: this.state.from,
        to: isPosition ? idx : (idx+1),
        current: [idx, isPosition ? idx : (idx+1)],
        done: true,
        selecting: false,
        selectingIdxes: isPosition ? rangeToIndices(this.state.from, idx+1) : rangeToIndices(this.state.from, idx+1+1),
      });
      // this.updateSelectingIdxDict();
      return this.state;
      // 就直接 done 了  不折腾了
    };
    // 按第三处
    if (this.state.done && this.state.from!=null && this.state.to!=null) {
      // 重新开始选
      Object.assign(this.state, {
        from: idx,
        current: [idx, isPosition ? idx : (idx+1)],
        to: isPosition ? null : (idx+1),
        done: false,
        selecting: true,
        selectingIdxes: isPosition ? [idx] : [idx, idx+1],
      });
      // this.updateSelectingIdxDict();
      return this.state;
    };
    return this.state;
  };

  onMouseEnter(idx, isPosition) {
    if (!this.state.selecting||this.state.done) { return this.state; };
    // console.log("onMouseEnter");
    idx = isPosition ? +idx+1 : +idx;
    const current = [idx, isPosition ? idx : (idx+1)];
    Object.assign(this.state, {current: current});
    const range = [this.state.from, this.state.to];
    if (current[1]>range[1]) {range[1] = current[1];};
    if (current[0]<range[0]) {range[0] = current[0];};
    Object.assign(this.state, {selectingIdxes: rangeToIndices(range[0], range[1]+1)});
    // this.updateSelectingIdxDict();
    return this.state;
  };

  onMouseLeave(idx, isPosition) {
    return this.state;
  };

  onMouseUp(idx, isPosition) {
    idx = isPosition ? +idx+1 : +idx;
    // 如果还什么都没选 或者已经选好了 则不玩了
    if (this.state.from == null || this.state.done || !this.state.selecting) {
      return this.state;
    };
    // 要么至少有 from  要么还没有 done 还在 selecting
    // 反正就是和第二次按下之后类似
    if (this.state.selecting && this.state.from!=null && (this.state.from!=this.state.current[0]||this.state.to!=this.state.current[1])) {
      if (this.state.to!=null && this.state.to>idx) {
        Object.assign(this.state, {
          from: idx,
          to: this.state.to,
          current: [idx, isPosition ? idx : (idx+1)],
          done: true,
          selecting: false,
          selectingIdxes: rangeToIndices(idx, this.state.to+1),
        });
        // this.updateSelectingIdxDict();
        return this.state;
      };
      // else
      Object.assign(this.state, {
        from: this.state.from,
        to: isPosition ? idx : (idx+1),
        current: [idx, isPosition ? idx : (idx+1)],
        done: true,
        selecting: false,
        selectingIdxes: isPosition ? rangeToIndices(this.state.from, idx+1) : rangeToIndices(this.state.from, idx+1+1),
      });
      // this.updateSelectingIdxDict();
      return this.state;
    };
    return this.state;
  };



};
