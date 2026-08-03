export const mockCategories = [
  { id: 'kavita', hi: 'कविता', en: 'Poem', icon: 'Feather' },
  { id: 'shayari', hi: 'शायरी', en: 'Shayari', icon: 'Sparkles' },
  { id: 'ghazal', hi: 'ग़ज़ल', en: 'Ghazal', icon: 'Music' },
  { id: 'kahani', hi: 'कहानी', en: 'Story', icon: 'BookOpen' },
  { id: 'lekh', hi: 'लेख', en: 'Article', icon: 'FileText' },
  { id: 'geet', hi: 'गीत', en: 'Song', icon: 'Mic' },
  { id: 'dohe', hi: 'दोहे', en: 'Couplets', icon: 'Bookmark' },
  { id: 'prerna', hi: 'प्रेरणादायक', en: 'Inspirational', icon: 'Compass' },
  { id: 'hasya', hi: 'हास्य', en: 'Humor', icon: 'Smile' },
  { id: 'bal', hi: 'बाल साहित्य', en: 'Children', icon: 'Heart' }
];

export const mockPosts = [
  {
    id: 'post-founder-1',
    author: {
      id: 'author-sanjayrai',
      name: 'संजय राय (संस्थापक)',
      username: '@sanjayrai_founder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      badge: 'founder',
      city: 'प्रयागराज',
      followers: 1250,
      isFollowing: true
    },
    title: 'बोलती कलम की साहित्यिक दुनिया में आपका हार्दिक स्वागत है!',
    category: 'lekh',
    content: `शब्द ही चेतना हैं और शब्द ही संस्कृति के सच्चे संवाहक हैं। 'बोलती कलम' की इस पावन साहित्यिक दुनिया में आप सभी कवियों, लेखकों व साहित्यप्रेमी पाठकों का मैं, संजय राय (संस्थापक), हृदय से स्वागत करता हूँ।

हमारा संकल्प हर उस रचनाकार को एक निडर व स्वतंत्र मंच प्रदान करना है, जिसकी लेखनी में समाज को नई दिशा देने का सामर्थ्य है। आइए मिलकर साहित्य के इस महायज्ञ में अपनी पंक्तियों की आहुति दें!`,
    tags: ['संस्थापकसंदेश', 'बोलतीकलम', 'संजयराय', 'स्वागत'],
    likes: 540,
    isLiked: true,
    bookmarks: 180,
    isBookmarked: true,
    views: 3420,
    readingTime: '2 मिनट',
    isEditorialPick: true,
    createdAt: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    comments: [
      {
        id: 'c1',
        author: 'आकाश कुमार सिंह (सह-संस्थापक)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        content: 'संस्थापक संजय राय जी के दूरदर्शी नेतृत्व में बोलती कलम डिजिटल युग का सबसे सशक्त साहित्यिक मंच बन रहा है। हार्दिक बधाई व स्वागत! 🙏',
        createdAt: 'अभी-अभी',
        likes: 120,
        isPinned: true
      }
    ]
  },
  {
    id: 'post-media-1',
    author: {
      id: 'author-akash',
      name: 'आकाश कुमार सिंह (सह-संस्थापक एवं डिजिटल मीडिया)',
      username: '@akash_cofounder',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      badge: 'digitalMedia',
      city: 'नई दिल्ली',
      followers: 980,
      isFollowing: true
    },
    title: 'डिजिटल क्रांति और बहुभाषी साहित्य का नया सवेरा',
    category: 'prerna',
    content: `तकनीक और साहित्य का यह अनूठा संगम देश-विदेश के लाखों साहित्यसाधकों को एक मंच पर ला रहा है। मैं, आकाश कुमार सिंह (सह-संस्थापक एवं डिजिटल मीडिया प्रमुख), आप सभी का बोलती कलम मंच पर आत्मीय स्वागत करता हूँ।

हमारा लक्ष्य हर रचनाकार की रचना को तकनीक के माध्यम से वैश्विक पहचान दिलाना और आधुनिक युवा पीढ़ी को अपनी समृद्ध भाषा व साहित्य से जोड़ना है।`,
    tags: ['डिजिटलमीडिया', 'आकाशकुमारसिंह', 'सहसंस्थापक', 'बोलतीकलम'],
    likes: 420,
    isLiked: true,
    bookmarks: 140,
    isBookmarked: false,
    views: 2890,
    readingTime: '2.5 मिनट',
    isEditorialPick: true,
    createdAt: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    comments: []
  }
];

export const mockDailyChallenge = {
  id: 'dc-101',
  date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
  topic: 'बरसात का पहला ख़त',
  description: 'इस सप्ताह का विषय "बरसात का पहला ख़त" है। अपनी भावनाओं को 100-200 शब्दों में कविता, शायरी या लघु-कथा के रूप में लिखें।',
  timeLeft: '4 दिन 14 घंटे',
  totalSubmissions: 12,
  participantCount: 12
};

export const mockPoetryBattle = {
  id: 'pb-202',
  title: 'काव्य संग्राम #1 — 80वाँ स्वतंत्रता दिवस विशेष',
  status: 'LIVE VOTING',
  totalVotes: 120,
  endsIn: '08:15:00',
  poet1: {
    id: 'poet-a',
    name: 'संजय राय (संस्थापक)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    title: 'माटी का स्वाभिमान (वीर रस)',
    lines: `रणचंडी का आह्वान सुनो, संहार धनुष पर बाण सुनो!
अरि शीश काटने आये हैं, भारत माँ का स्वाभिमान सुनो!!
हम झुके नहीं, हम रुके नहीं, यह रघुकुल की हुंकार रही!
हर बूँद लहू की माटी पर न्योछावर बारंबार रही!!`,
    votes: 75,
    percentage: 625
  },
  poet2: {
    id: 'poet-b',
    name: 'आकाश कुमार सिंह (सह-संस्थापक)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    title: 'तिरंगे की शान (देशभक्ति)',
    lines: `तिरंगे की शान में गाएँ हम वीरों की गाथा अमर।
भारत माँ के चरणों में नत मस्तक है ये सारा नगर!!
डिजिटल युग की इस क्रांति में गूँजेगी वीरों की हुंकार!
बोलती कलम के पन्नों पर अंकित होगा स्वर्णिम विचार!!`,
    votes: 45,
    percentage: 375
  }
};
