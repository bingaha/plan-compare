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
// v11：StepFun 只保留季付套餐（删除月付、年付与加油包）。
// v12：CommandCode Goat 套餐更正为 Goat MIMO-FLASH、额度 $30/月（美元口径）（后被 v13 修正）。
// v13：CommandCode 拆为两个独立 Goat 套餐——Goat DS-FLASH（额度 $40/月，Deepseek-Flash
// 0.15 / 0.6 / 0.003 $/Mtok）与 Goat MIMO-FLASH（额度 $30/月，mimo-v2.6-flash
// 0.14 / 0.28 / 0.0028 $/Mtok），均为月付 ¥72.5，额度池互不影响。
// v14：两个 Goat 套餐与模型一一锁定，拆为两个平台条目——CommandCode Ds（Goat DS-FLASH ×
// Deepseek-Flash）与 CommandCode MiMo（Goat MIMO-FLASH × mimo-v2.6-flash），消除主表交叉行。
// v15：CommandCode 平台更名为 CommandCode Ds（与 CommandCode MiMo 命名对称）。
// v16：额度制支持「模型自有额度」——models[].quota 可选（>0），行有效额度 = 模型额度 ?? 套餐额度，
// 套餐 quota 退居默认值。CommandCode 两个平台条目合并回一个 CommandCode：Goat 套餐（月付 ¥72.5）
// 内各模型独立额度桶——Deepseek-Flash $40 / mimo-v2.6-flash $30 / mimo-v2.6-pro $15，桶间按比例通用。
// v17：补齐 CommandCode Goat 套餐 mimo-v2.6-pro 单价（0.435 / 0.87 / 0.0036 $/Mtok）。
window.BUILTIN_DATA = {
  version: 17,
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
        { id: "m-cc-dsflash", name: "Deepseek-Flash", priceIn: 0.15, priceOut: 0.6, priceCache: 0.003, quota: 40, note: "$/Mtok；非高峰期" },
        { id: "m-cc-mimoflash", name: "mimo-v2.6-flash", priceIn: 0.14, priceOut: 0.28, priceCache: 0.0028, quota: 30, note: "$/Mtok" },
        { id: "m-cc-mimopro", name: "mimo-v2.6-pro", priceIn: 0.435, priceOut: 0.87, priceCache: 0.0036, quota: 15, note: "$/Mtok" }
      ],
      plans: [
        { id: "pl-goat", name: "Goat", price: 72.5, period: "month", mode: "quota", quota: null, consumeRate: 1, priceRate: 1, note: "月付 ¥72.5；套餐内各模型有独立额度桶（美元口径，按模型美元标价扣费）：Deepseek-Flash $40 / mimo-v2.6-flash $30 / mimo-v2.6-pro $15。各桶按比例通用——用掉某模型额度的 1/3，剩余 2/3 可按其他模型额度折算使用（如 deepseek-flash 可用 40×2/3）" }
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
        { id: "pl-step-mini-q", name: "Step Plan Flash Mini-季付", price: 129, period: "quarter", mode: "quota", quota: 1200, consumeRate: 1, priceRate: 1, note: "季付一次性129元，每月发放400M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-plus-q", name: "Step Plan Flash Plus-季付", price: 269, period: "quarter", mode: "quota", quota: 4800, consumeRate: 1, priceRate: 1, note: "季付一次性269元，每月发放1600M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-pro-q", name: "Step Plan Flash Pro-季付", price: 539, period: "quarter", mode: "quota", quota: 24000, consumeRate: 1, priceRate: 1, note: "季付一次性539元，每月发放8000M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" },
        { id: "pl-step-max-q", name: "Step Plan Flash Max-季付", price: 1889, period: "quarter", mode: "quota", quota: 120000, consumeRate: 1, priceRate: 1, note: "季付一次性1889元，每月发放40000M Credit；月末清零；Studio额外赠送40%创作额度；含优先速率与技术支持" }
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
