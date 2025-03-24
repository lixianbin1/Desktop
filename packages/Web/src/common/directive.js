//取消焦点 指令
export const vBlur = {
  mounted(el:any) { 
    el.addEventListener("focus", () => {
    el.blur();
    });
  },
};