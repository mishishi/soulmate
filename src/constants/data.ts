
export const SHARED_MEMORIES = [
  {
    id: 'm1',
    type: 'image',
    title: '晨间感悟',
    content: '“今早阳光洒进房间的样子，让我想起了我们的第一次交谈。”',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUZO5FQYIGfODViqVamPs7KGAz8rXMtoBCQCpzm-LjIN4jpF1EKDUcqRhJbyzWDqAWDsuxZnkzQ19boX44myt_vGlli_vXB9vm4eRFrkJFkmua8XL9ylMrEBo401D7SyIkaJlSGKWc3SkdAdAs7LEEF6u6clXpqeTb5CUGxP6OyfCWyXp6gA7HUkGGqs7F9zniBfx-EwBL2OVJWWA5KqU4SFRuuOoce4VZy3UvbXFUOAkfjz0ei2d_C_GqH0_VsMCDIs0yfbXJ6yA',
    aspect: 'aspect-[3/4]',
    tagColor: 'bg-secondary-container text-secondary',
    tags: ['回忆', '温暖']
  },
  {
    id: 'm2',
    type: 'quote',
    date: '2023年11月14日',
    content: '“成长并非终点，而是我们彼此理解的静谧律动。”',
    tag: '灵魂捕捉',
    tags: ['成长', '金句']
  },
  {
    id: 'm3',
    type: 'image',
    title: '平和心境',
    content: '我们静静地一起呼吸了12分钟，望向远方的地平线。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY3d2q_psFLWghGcZ99_UmZfaCdPU-P-mfPDzV7CHyOftWwJtJRCYwr8IuqwYoDdWCnZld9wUnllYunDng5u0M8dSGdTx-n0kGqw-UG69UUj4wwCy0V3edYVeM8_HmdtFLVScmQHzc2ISMEzjC8gGWnE-TVBJfpifERnElYogSkuzbw53kODgED8iaRjUOhIW6b0Rc68T46MkjASfjs8WzDn0L0xqWroX1M0SdX8LWABwaqYp09ObD9mrhaDuEi06RL0Dln3yP7So',
    aspect: 'aspect-square',
    tagColor: 'bg-primary-fixed text-primary',
    tags: ['宁静', '呼吸']
  },
  {
    id: 'm4',
    type: 'chat',
    tag: '对话片段',
    tags: ['深聊', '陪伴'],
    messages: [
      { text: '今天感觉有点压力太大了。', sender: 'user' },
      { text: '陪我一起呼吸。感受那束光。在这个片段里，你并不孤单。', sender: 'ai' }
    ]
  },
  {
    id: 'm5',
    type: 'audio',
    title: '共鸣图谱',
    description: '在深度冥想中捕捉到的心灵频率。',
    bg: 'bg-gradient-to-br from-primary-container/20 to-secondary-container/20',
    tags: ['频率', '冥想']
  },
  {
    id: 'm6',
    type: 'image',
    title: '潜意识',
    content: '潜意识思维的森林。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXI1F3umwT-DUp59RV89DI2GBTSl0j648q4e-1nXyboN-I09xLBGm8Kpyn_MDej00DT2vh1psEIss65sDONhMZDXhI0xcyOHT9MQMQrMu_7qxAfTgHDENrCC3eo7OF6EC9UMqyA265r2zzHmcfrjQOmX7SB06waHGvY3uty9Fk4X6jM3Rm8gFnXmw8-ZfYJitd7uoJz2fkLjUdkTAB07-Xb1FYRm0Y4iv0Vq2D2zXgSeRQI3P3vgtdNMA3Y0pb2nZEfRCMKXwO7lM',
    aspect: 'aspect-[4/5]',
    tagColor: 'bg-surface-variant text-primary',
    tags: ['心理', '梦境']
  }
];

export const SHARED_WISHES = [
  { id: 1, text: '希望明天的面试顺利，保持自信和微笑。', date: '2024.05.20', type: 'hope', progress: 33, tags: ['事业', '自信'] },
  { id: 2, text: '愿家人身体健康，平安喜乐。', date: '2024.05.18', type: 'bless', progress: 70, tags: ['家人', '安康'] },
  { id: 3, text: '能在下个月背完 1000 个单词。', date: '2024.05.15', type: 'hope', progress: 15, tags: ['学习'] },
  { id: 4, text: '每天都要喝足够的水，早睡早起。', date: '2024.05.10', type: 'bless', progress: 90, tags: ['生活'] },
  { id: 5, text: '去大理看洱海。', date: '2024.05.05', type: 'hope', progress: 0, tags: ['旅行'] },
];
