// 内置数据（种子）：首次打开整份复制进浏览器 localStorage，之后用户的维护都发生在本地副本上，
// 本文件永远保持出厂状态。更新内置数据时改这里并递增 version：
//   用户没改过（modified=false）→ 自动跟上新版；改过 → 保留用户数据并在页面提示。
// 格式 v3（层级）：platforms[].models[] 存模型单价，platforms[].plans[] 存套餐价格与倍率，
// 主表的每一行 = 平台下的 套餐 × 模型 自动配对。
// v4 基准（取自用户 2026-09-18 页面录入）：模型单价为积分抵扣系数口径（积分/Mtok），
// 套餐为季付价；智谱三档各有两套——高峰期（消耗倍率 2）与去掉高峰期的标准（消耗倍率 1）。
// v5（取自用户 2026-09-18 最新调整）：CommandCode 补充 Deepseek-Flash 模型价（元/Mtok），
// Goat 套餐定名 Goat DS-FLASH（月付 72.5 元、额度 40 元）。
// v6：新增 R4coder 平台——deepseek-flash 5 美元套餐（¥36/月，额度 $30 按美元标价扣，消耗倍率 2，
// 模型价 0.3/1.2/0.006 $/Mtok）。
// v7：新增 阶跃星辰StepFun 平台（Credit 月池全模型共享）。
// v8：StepFun 改为逐模型建模——拿到三个模型的 API 原价（输入命中/未命中/输出，元/Mtok）后，
// 平台拆为 step-5-preview / step-3.7-flash / step-3.5-flash，套餐改额度制，额度 = 周期内 Credit 池
// （1M Credit = 1元，季/年付为该周期累计发放量），综合单价按全局混合比公式现算，与官方口径一致。
// v9：StepFun 移除 step-3.5-flash（只保留 step-5-preview 与 step-3.7-flash 两个模型）。
// v10：新增 小米 MiMo 平台（Xiaomi MiMo Token Plan）——Lite/Standard/Pro/Max 四档月付
// （¥39/99/329/659），套餐总量 41/110/380/820 亿 Credits（≈1/2.7/9.3/20 × Lite）。
// 模型 mimo-v2.6-pro / mimo-v2.6-flash 官方按 Token 标价（命中/未命中/输出 Credits）：
// pro 2.5/300/600，flash 2/100/200。本表统一折算为「百万 Credits」口径：
// 套餐额度 41亿 = 4100（百万 Credits）；模型单价每 Mtok 多少百万 Credits，
// 数值与官方「每 Token Credits」标价相同（300 Credits/Token ≡ 300 百万Credits/Mtok）。
window.BUILTIN_DATA = {
  version: 10,
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
    },
    {
      id: "p-r4coder",
      name: "R4coder",
      models: [
        { id: "m-r4-dsflash", name: "deepseek-flash", priceIn: 0.3, priceOut: 1.2, priceCache: 0.006, note: "" }
      ],
      plans: [
        { id: "pl-r4-ds5", name: "R4coder deepseek-flash 5美元套餐", price: 36, period: "month", mode: "quota", quota: 30, consumeRate: 2, priceRate: 1, note: "$5 档月付，实付 ¥36。额度 $30 按模型美元标价扣费，rate=2 计为消耗倍率 2。" }
      ]
    },
    {
      id: "p-stepfun",
      name: "阶跃星辰StepFun",
      models: [
        { id: "m-step-5", name: "step-5-preview", priceIn: 7.00, priceOut: 20.00, priceCache: 0.35, note: "" },
        { id: "m-step-37f", name: "step-3.7-flash", priceIn: 1.35, priceOut: 8.10, priceCache: 0.27, note: "" }
      ],
      plans: [
        { id: "pl-step-mini", name: "Step Plan Flash Mini", price: 49, period: "month", mode: "quota", quota: 400, consumeRate: 1, priceRate: 1, note: "入门体验；400M Credit/月，月末清零；Studio额外赠送40%创作额度；无优先速率；支持全部旗舰模型、MCP StepSearch" },
        { id: "pl-step-plus", name: "Step Plan Flash Plus", price: 99, period: "month", mode: "quota", quota: 1600, consumeRate: 1, priceRate: 1, note: "日常提效；1600M Credit/月，月末清零；Studio额外赠送40%创作额度；含优先API速率、优先技术支持；支持全部旗舰模型、MCP StepSearch" },
        { id: "pl-step-pro", name: "Step Plan Flash Pro", price: 199, period: "month", mode: "quota", quota: 8000, consumeRate: 1, priceRate: 1, note: "高频深度使用；8000M Credit/月，月末清零；Studio额外赠送40%创作额度；含优先API速率、优先技术支持；支持全部旗舰模型、MCP StepSearch" },
        { id: "pl-step-max", name: "Step Plan Flash Max", price: 699, period: "month", mode: "quota", quota: 40000, consumeRate: 1, priceRate: 1, note: "高强度专业使用；40000M Credit/月，月末清零；Studio额外赠送40%创作额度；含优先API速率、优先技术支持；支持全部旗舰模型、MCP StepSearch" },
        { id: "pl-step-mini-q", name: "Step Plan Flash Mini-季付", price: 129, period: "quarter", mode: "quota", quota: 1200, consumeRate: 1, priceRate: 1, note: "季付一次性129元，每月发放400M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-plus-q", name: "Step Plan Flash Plus-季付", price: 269, period: "quarter", mode: "quota", quota: 4800, consumeRate: 1, priceRate: 1, note: "季付一次性269元，每月发放1600M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-pro-q", name: "Step Plan Flash Pro-季付", price: 539, period: "quarter", mode: "quota", quota: 24000, consumeRate: 1, priceRate: 1, note: "季付一次性539元，每月发放8000M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-max-q", name: "Step Plan Flash Max-季付", price: 1889, period: "quarter", mode: "quota", quota: 120000, consumeRate: 1, priceRate: 1, note: "季付一次性1889元，每月发放40000M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-mini-y", name: "Step Plan Flash Mini-年付", price: 456, period: "year", mode: "quota", quota: 4800, consumeRate: 1, priceRate: 1, note: "年付一次性456元，每月发放400M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-plus-y", name: "Step Plan Flash Plus-年付", price: 936, period: "year", mode: "quota", quota: 19200, consumeRate: 1, priceRate: 1, note: "年付一次性936元，每月发放1600M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-pro-y", name: "Step Plan Flash Pro-年付", price: 1860, period: "year", mode: "quota", quota: 96000, consumeRate: 1, priceRate: 1, note: "年付一次性1860元，每月发放8000M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-max-y", name: "Step Plan Flash Max-年付", price: 6666, period: "year", mode: "quota", quota: 480000, consumeRate: 1, priceRate: 1, note: "年付一次性6666元，每月发放40000M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-oil-s", name: "Step Plan 小油包(加油包)", price: 49, period: "month", mode: "quota", quota: 400, consumeRate: 1, priceRate: 1, note: "仅订阅用户可购买；400M Credit；独立30天有效期，不跟随套餐月池周期（周期按30天≈1月折算）" },
        { id: "pl-step-oil-l", name: "Step Plan 大油包(加油包)", price: 99, period: "month", mode: "quota", quota: 1600, consumeRate: 1, priceRate: 1, note: "仅订阅用户可购买；1600M Credit；独立30天有效期，不跟随套餐月池周期（周期按30天≈1月折算）" }
      ]
    },
    {
      id: "p-mimo",
      name: "小米 MiMo",
      models: [
        { id: "m-mimo-pro", name: "mimo-v2.6-pro", priceIn: 300, priceOut: 600, priceCache: 2.5, note: "官方按 Token 标价：命中缓存 2.5 / 未命中 300 / 输出 600（Credits/Token）。本表单价单位为百万 Credits/Mtok（与官方每 Token 标价数值相同）" },
        { id: "m-mimo-flash", name: "mimo-v2.6-flash", priceIn: 100, priceOut: 200, priceCache: 2, note: "官方按 Token 标价：命中缓存 2 / 未命中 100 / 输出 200（Credits/Token）。单位口径同 mimo-v2.6-pro" }
      ],
      plans: [
        { id: "pl-mimo-lite", name: "Token Plan Lite", price: 39, period: "month", mode: "quota", quota: 4100, consumeRate: 1, priceRate: 1, note: "轻量体验；每月 41 亿 Credits 套餐总量；支持 V2.6 全新旗舰模型（文本模型 / 全模态 / 语音）；按月计费。额度单位：百万 Credits（41亿 = 4100）" },
        { id: "pl-mimo-std", name: "Token Plan Standard", price: 99, period: "month", mode: "quota", quota: 11000, consumeRate: 1, priceRate: 1, note: "日常办公；每月 110 亿 Credits（≈ 2.7 x Lite）；支持 V2.6 全新旗舰模型（文本模型 / 全模态 / 语音）；按月计费" },
        { id: "pl-mimo-pro", name: "Token Plan Pro", price: 329, period: "month", mode: "quota", quota: 38000, consumeRate: 1, priceRate: 1, note: "专业开发；每月 380 亿 Credits（≈ 9.3 x Lite）；支持 V2.6 全新旗舰模型（文本模型 / 全模态 / 语音）；按月计费" },
        { id: "pl-mimo-max", name: "Token Plan Max", price: 659, period: "month", mode: "quota", quota: 82000, consumeRate: 1, priceRate: 1, note: "高强度开发；每月 820 亿 Credits（= 20 x Lite）；支持 V2.6 全新旗舰模型（文本模型 / 全模态 / 语音）；按月计费" }
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
