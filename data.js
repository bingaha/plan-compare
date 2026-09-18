// 内置数据：随页面加载，永远保持出厂状态。用户的修改存放在浏览器 localStorage，不写回本文件。
// 更新内置数据时改这里，并视情况递增 version（用户未修改过的字段会自动跟上新版本）。
window.BUILTIN_DATA = {
  version: 1,
  global: {
    inputRatio: 0.99,
    cacheHitRate: 0.95,
    outputRatio: 0.01
  },
  plans: [
    {
      id: "lite-53",
      platform: "智谱 Z.ai",
      plan: "Coding Plan Lite",
      model: "GLM-5.3",
      mode: "quota",
      price: 118,
      period: "month",
      usageM: null,
      quota: 1770,
      priceIn: 8,
      priceOut: 28,
      priceCache: 2,
      consumeRate: 1,
      priceRate: 1,
      note: "新版积分制月付价（第三方核对，以订阅页为准）；额度=月费×15（官方口径15-30倍取保守，按API价折算）；官方周参考表口径约209~422 Mtok/月"
    },
    {
      id: "lite-53f",
      platform: "智谱 Z.ai",
      plan: "Coding Plan Lite",
      model: "GLM-5.3-flash",
      mode: "quota",
      price: 118,
      period: "month",
      usageM: null,
      quota: 1770,
      priceIn: 0.8,
      priceOut: 2.8,
      priceCache: 0.23,
      consumeRate: 1,
      priceRate: 1,
      note: "同 Lite×GLM-5.3；单价为国内人民币 API 价（每 Mtok）"
    },
    {
      id: "pro-53",
      platform: "智谱 Z.ai",
      plan: "Coding Plan Pro",
      model: "GLM-5.3",
      mode: "quota",
      price: 538,
      period: "month",
      usageM: null,
      quota: 8070,
      priceIn: 8,
      priceOut: 28,
      priceCache: 2,
      consumeRate: 1,
      priceRate: 1,
      note: "额度=月费×15 保守口径；官方周参考表约1260~2520 Mtok/月"
    },
    {
      id: "pro-53f",
      platform: "智谱 Z.ai",
      plan: "Coding Plan Pro",
      model: "GLM-5.3-flash",
      mode: "quota",
      price: 538,
      period: "month",
      usageM: null,
      quota: 8070,
      priceIn: 0.8,
      priceOut: 2.8,
      priceCache: 0.23,
      consumeRate: 1,
      priceRate: 1,
      note: "同 Pro×GLM-5.3"
    },
    {
      id: "max-53",
      platform: "智谱 Z.ai",
      plan: "Coding Plan Max",
      model: "GLM-5.3",
      mode: "quota",
      price: 1078,
      period: "month",
      usageM: null,
      quota: 16170,
      priceIn: 8,
      priceOut: 28,
      priceCache: 2,
      consumeRate: 1,
      priceRate: 1,
      note: "额度=月费×15 保守口径；官方周参考表约2939~5878 Mtok/月"
    },
    {
      id: "max-53f",
      platform: "智谱 Z.ai",
      plan: "Coding Plan Max",
      model: "GLM-5.3-flash",
      mode: "quota",
      price: 1078,
      period: "month",
      usageM: null,
      quota: 16170,
      priceIn: 0.8,
      priceOut: 2.8,
      priceCache: 0.23,
      consumeRate: 1,
      priceRate: 1,
      note: "同 Max×GLM-5.3"
    }
  ],
  scores: {
    "Artificial Analysis": {
      "GLM-5.3": 45,
      "GLM-5.3-flash": 42
    },
    "LMArena": {
      "GLM-5.3": 1483,
      "GLM-5.3-flash": 1475
    }
  }
};
