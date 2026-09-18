// 内置数据（种子）：首次打开整份复制进浏览器 localStorage，之后用户的维护都发生在本地副本上，
// 本文件永远保持出厂状态。更新内置数据时改这里并递增 version：
//   用户没改过（modified=false）→ 自动跟上新版；改过 → 保留用户数据并在页面提示。
// 格式 v3（层级）：platforms[].models[] 存模型单价，platforms[].plans[] 存套餐价格与倍率，
// 主表的每一行 = 平台下的 套餐 × 模型 自动配对。
// v4 基准（取自用户 2026-09-18 页面录入）：模型单价为积分抵扣系数口径（积分/Mtok），
// 套餐为季付价；智谱三档各有两套——高峰期（消耗倍率 2）与去掉高峰期的标准（消耗倍率 1）。
// v5（取自用户 2026-09-18 最新调整）：CommandCode 补充 Deepseek-Flash 模型价（元/Mtok），
// Goat 套餐定名 Goat DS-FLASH（月付 72.5 元、额度 40 元）。
window.BUILTIN_DATA = {
  version: 5,
  global: {
    inputRatio: 0.99,
    cacheHitRate: 0.95,
    outputRatio: 0.01
  },
  platforms: [
    {
      id: "p-zai",
      name: "智谱 Z.ai",
      models: [
        { id: "m-53", name: "GLM-5.3", priceIn: 690, priceOut: 2400, priceCache: 170, note: "" },
        { id: "m-53f", name: "GLM-5.3-flash", priceIn: 230, priceOut: 800, priceCache: 56, note: "抵扣系数：Input 2.3 / Cached 0.56 / Output 8（每万 Token）。夜间 23:00-09:00 在 ZCode 端无限使用。" }
      ],
      plans: [
        {
          id: "pl-lite", name: "V3  Lite 高峰期", price: 283.2, period: "quarter", mode: "quota",
          quota: 128571, consumeRate: 2, priceRate: 1,
          note: "官方积分制：每周 10,000 积分。GLM-5.3 抵扣系数：Input 6.9 / Cached 1.7 / Output 24（每万 Token）。非高峰时段（含周末全天）积分消耗按 50% 抵扣。高峰时段：周一至周五 14:00-18:00。"
        },
        {
          id: "pl-pro", name: "V3  Pro 高峰期", price: 1291.2, period: "quarter", mode: "quota",
          quota: 771428, consumeRate: 2, priceRate: 1,
          note: "官方积分制：每周 60,000 积分。抵扣系数同 Lite。非高峰时段消耗减半。"
        },
        {
          id: "pl-max", name: "V3 Max 高峰期", price: 2587.2, period: "quarter", mode: "quota",
          quota: 1800000, consumeRate: 2, priceRate: 1,
          note: "官方积分制：每周 140,000 积分。抵扣系数同 Lite。非高峰时段消耗减半。"
        },
        {
          id: "pl-lite-any", name: "V3 Lite", price: 283.2, period: "quarter", mode: "quota",
          quota: 128571, consumeRate: 1, priceRate: 1,
          note: "官方积分制：每周 10,000 积分。GLM-5.3 抵扣系数：Input 6.9 / Cached 1.7 / Output 24（每万 Token）。非高峰时段（含周末全天）积分消耗按 50% 抵扣。高峰时段：周一至周五 14:00-18:00。"
        },
        {
          id: "pl-pro-any", name: "V3 Pro", price: 1291.2, period: "quarter", mode: "quota",
          quota: 771428, consumeRate: 1, priceRate: 1,
          note: "官方积分制：每周 60,000 积分。抵扣系数同 Lite。非高峰时段消耗减半。"
        },
        {
          id: "pl-max-any", name: "V3 Max", price: 2587.2, period: "quarter", mode: "quota",
          quota: 1800000, consumeRate: 1, priceRate: 1,
          note: "官方积分制：每周 140,000 积分。抵扣系数同 Lite。非高峰时段消耗减半。"
        }
      ]
    },
    {
      id: "p-cc",
      name: "CommandCode",
      models: [
        { id: "cf74ebd2-e70e-4f30-96c1-1dd7b486ba0d", name: "Deepseek-Flash", priceIn: 0.15, priceOut: 0.6, priceCache: 0.003, note: "非高峰期" }
      ],
      plans: [
        { id: "pl-goat", name: "Goat DS-FLASH", price: 72.5, period: "month", mode: "quota", quota: 40, consumeRate: 1, priceRate: 1, note: "" }
      ]
    }
  ],
  scores: [
    { src: "Artificial Analysis", model: "GLM-5.3", value: 45 },
    { src: "Artificial Analysis", model: "GLM-5.3-flash", value: 42 },
    { src: "LMArena", model: "GLM-5.3", value: 1483 },
    { src: "LMArena", model: "GLM-5.3-flash", value: 1475 }
  ]
};
