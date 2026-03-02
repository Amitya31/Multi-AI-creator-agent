export const agentQueue = {
  add: async (
    _name: string,
    _data: any,
    _options?: any
  ) => {
    console.log("Queue disabled (Vercel-safe mode)");
    return;
  },
};