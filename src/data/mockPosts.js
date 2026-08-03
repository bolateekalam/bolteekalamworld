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
      followers: 245000,
      isFollowing: true
    },
    title: 'बोलती कलम - साहित्य की अविरल धारा',
    category: 'lekh',
    content: `शब्द ही चेतना हैं, शब्द ही संस्कृति के संवाहक हैं। 'बोलती कलम' का उद्देश्य हर उस रचनाकार को एक पवित्र मंच प्रदान करना है, जिसकी पंक्तियों में समाज को बदलने और अंतर्मन को झकझोरने का सामर्थ्य है।

साहित्य की यह यात्रा अविरल बहती रहेगी। सभी कवियों, साहित्यकारों और पाठकों को नव-साहित्यिक युग की अनंत शुभकामनाएँ!`,
    tags: ['संस्थापकसंदेश', 'बोलतीकलम', 'संजयराय', 'हिंदीसाहित्य'],
    likes: 12450,
    isLiked: true,
    bookmarks: 3400,
    isBookmarked: true,
    views: 89400,
    readingTime: '2 मिनट',
    isEditorialPick: true,
    createdAt: '1 घंटे पहले',
    comments: [
      {
        id: 'c1',
        author: 'आकाश कुमार सिंह (डिजिटल मीडिया)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        content: 'संस्थापक संजय राय जी के दूरदर्शी विचारों से प्रेरित होकर डिजिटल मीडिया के क्षेत्र में बोलती कलम नए आयाम स्थापित कर रहा है। 🙏',
        createdAt: '45 मिनट पहले',
        likes: 420,
        isPinned: true
      }
    ]
  },
  {
    id: 'post-media-1',
    author: {
      id: 'author-akash',
      name: 'आकाश कुमार सिंह (डिजिटल मीडिया)',
      username: '@akash_digitalmedia',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      badge: 'digitalMedia',
      city: 'नई दिल्ली',
      followers: 98400,
      isFollowing: true
    },
    title: 'डिजिटल क्रांति और हिंदी साहित्य का नया सवेरा',
    category: 'prerna',
    content: `तकनीक और साहित्य जब एक साथ मिलते हैं, तो ज्ञान की सीमाओं का विस्तार होता है। बोलती कलम के डिजिटल प्लेटफ़ॉर्म और सोशल मीडिया माध्यमों से आज लाखों युवा साहित्यप्रेमी प्रतिदिन जुड़ रहे हैं।

डिजिटल मीडिया के माध्यम से हम हर रचनाकार की आवाज़ को वैश्विक पटल पर पहुँचाने के लिए प्रतिबद्ध हैं।`,
    tags: ['डिजिटलमीडिया', 'आकाशकुमारसिंह', 'बोलतीकलम', 'तकनीक'],
    likes: 8420,
    isLiked: true,
    bookmarks: 1890,
    isBookmarked: false,
    views: 54200,
    readingTime: '2.5 मिनट',
    isEditorialPick: true,
    createdAt: '3 घंटे पहले',
    comments: []
  },
  {
    id: 'post-1',
    author: {
      id: 'author-1',
      name: 'डॉ. कुमार विश्वास',
      username: '@kumarvishwas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      badge: 'verifiedAuthor',
      city: 'नई दिल्ली',
      followers: 124500,
      isFollowing: true
    },
    title: 'कोई दीवाना कहता है, कोई पागल समझता है',
    category: 'kavita',
    content: `कोई दीवाना कहता है, कोई पागल समझता है!
मगर धरती की बेचैनी को बस बादल समझता है!!
मैं तुझसे दूर कैसा हूँ, तू मुझसे दूर कैसी है!
ये मेरा दिल समझता है या तेरा दिल समझता है!!

समंदर पीर का अंदर है लेकिन रो नहीं सकता!
यह आँसू प्यार का मोती है इसको खो नहीं सकता!!
मेरी चाहत को दुल्हन तू बना लेना मगर सुन ले!
जो मेरा हो नहीं पाया वो तेरा हो नहीं सकता!!`,
    tags: ['प्रेमानुभूति', 'कविता', 'कुमारविश्वास', 'हिंदीसाहित्य'],
    likes: 4890,
    isLiked: false,
    bookmarks: 1200,
    isBookmarked: true,
    views: 34500,
    readingTime: '2 मिनट',
    isEditorialPick: true,
    createdAt: '5 घंटे पहले',
    audioUrl: 'mock-audio.mp3',
    comments: []
  }
];

export const mockDailyChallenge = {
  id: 'dc-101',
  date: '02 अगस्त 2026',
  topic: 'बरसात का पहला ख़त',
  description: 'इस सप्ताह का विषय "बरसात का पहला ख़त" है। अपनी भावनाओं को 100-200 शब्दों में कविता, शायरी या लघु-कथा के रूप में लिखें।',
  timeLeft: '4 दिन 14 घंटे',
  totalSubmissions: 342,
  participantCount: 342
};

export const mockPoetryBattle = {
  id: 'pb-202',
  title: 'काव्य संग्राम #42 — शृंगार बनाम वीर रस',
  status: 'LIVE VOTING',
  totalVotes: 14850,
  endsIn: '08:15:00',
  poet1: {
    id: 'poet-a',
    name: 'कवि अमोल मिश्र',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    title: 'माटी का स्वाभिमान (वीर रस)',
    lines: `रणचंडी का आह्वान सुनो, संहार धनुष पर बाण सुनो!
अरि शीश काटने आये हैं, भारत माँ का स्वाभिमान सुनो!!
हम झुके नहीं, हम रुके नहीं, यह रघुकुल की हुंकार रही!
हर बूँद लहू की माटी पर न्योछावर बारंबार रही!!`,
    votes: 8420,
    percentage: 57
  },
  poet2: {
    id: 'poet-b',
    name: 'कवयित्री नेहा शर्मा',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: 'सावन की साँझ (शृंगार रस)',
    lines: `पायल की छम-छम कहती है, काना तुम कब आओगे!
नेह के पावन बंधन को किस भाँति सजाओगे!!
बदरा छाए, कजरा भीगे, विरह विकल यह रैन ढले!
तुम आओ तो चंदा चमके, उजयारी की दीप जले!!`,
    votes: 6430,
    percentage: 43
  }
};
