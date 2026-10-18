import type { PagesCopy } from "../types";

const copy: PagesCopy = {
  about: {
    eyebrow: "关于我们",
    title: "准备面试的最佳方式，是与面试官一起练习",
    lead: "Zeeta 将候选人与银行、咨询和科技行业的专业人士联系起来，进行视频模拟面试，并在面试后提供书面反馈。",
    missionTitle: "为什么选择 Zeeta",
    mission: [
      "投资银行、咨询和科技行业的面试都有自己的规则。这些规则很少能从书本中学到，而是由坐在面试桌另一边的人传授。",
      "Zeeta 让这些知识触手可及。每位候选人都可以选择本行业的导师，在真实面试条件下练习，并获得关于需要改进之处的精准反馈。",
    ],
    stats: { mentors: "位已认证导师", tracks: "个方向", rate: "导师每小时价格" },
    valuesTitle: "我们的原则",
    values: [
      { title: "招聘者担任导师", desc: "每位导师都经过认证，并且正在或曾经在其指导的行业工作。" },
      { title: "具体的反馈", desc: "每次面试后，提供逐点书面反馈和行动计划。" },
      { title: "公开透明", desc: "预约前即可看到每位导师的背景和价格。" },
    ],
    candidates: { title: "正在准备面试？", desc: "找到本行业的导师并预约一次面试。", cta: "寻找导师" },
    mentors: { title: "经历过这些？", desc: "分享你的经验，并自行设定价格。", cta: "成为导师" },
  },
  contact: {
    title: "联系我们",
    lead: "对面试、导师资料或合作有疑问？给我们写信，我们会通过电子邮件回复。",
    emailLabel: "我们的邮箱",
    topics: [
      { title: "候选人", desc: "预约、面试、反馈、退款。" },
      { title: "导师", desc: "资料、认证、日程、价格。" },
      { title: "媒体与合作", desc: "学校、社团、企业、媒体。" },
    ],
    formTitle: "发送消息",
    name: "你的姓名",
    email: "你的邮箱",
    topic: "主题",
    message: "你的消息",
    send: "生成邮件",
    sendNote: "点击按钮将打开你的邮件应用，并自动填好消息。",
    faqPrompt: "你的问题可能已在",
    faqLink: "常见问题中",
  },
  legal: {
    updated: "最后更新：",
    toc: "目录",
    frenchOnly: "本文件仅提供法语版本，以法语版本为准。",
    draftNote: "高亮内容需在上线前补充完整。",
  },
};

export default copy;
