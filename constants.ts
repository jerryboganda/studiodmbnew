import { ProfileMatch, User, CompatibilityMetric, ActivityItem, Chat } from './types';

export const CURRENT_USER: User = {
  name: 'Dr. Rajesh Kumar',
  specialty: 'MD Gen. Medicine',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzaeWWENYBM2epJ60q01dnFi4yz9YiDXwYV1EcDpGsU1Z-chVQmIqfs1U7m1enVrZEgaqiAL48Wvmleo4yRa9cBGga6j-LEf-P3Ho0KsEw9xfZSyQG3wNMsUkO8ogL8vk2iDwFJm5NtbsXMNvmPodIL3nQnT0M5IGF8jTeSkGjKhPNKnO9QwlZhliJ15ahx-2B289fTui5atTjNPc5CzfxkbA2dzyZDiVpuHek_5h9OrbVpmGA-mfOhwW7KtWkAG1b2ulDY4C42bM'
};

export const MAIN_PROFILE: ProfileMatch = {
  id: '1',
  name: 'Dr. Aditi Sharma, MD',
  specialty: 'Interventional Cardiology',
  hospital: 'City Heart Institute',
  location: 'New Delhi',
  age: 29,
  matchPercentage: 98,
  isVerified: true,
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxXuKVKvrrNXYrG-CY1ssc7c8MM0q4JHAY75reeW_PbVx6mcGg2IWd0ZWJJdglbFYo-odqtaxEZSoEU9TDAChhZ_YgCKJmbKtlnAh_bFl1HkS5BrMhak_-V5ms913RD14CEyw6wgE1V_WqRWRfk-k0wfB0jnK_GlS_w980MpPHAm3G_IadeEXaFHmTTiI-TgRihMq1zYSIDjWu19ZqeSkDVEd-WO3R0nFXnsoYA2C3kJqb5DS0_tX8Z12bor2ZslGRfDBc2vmzuMg',
  coverGradient: 'bg-gradient-to-r from-pink-100 to-purple-100',
  bio: "Passionate about advancements in cardiac care. When I'm not in the cath lab, you can find me hiking or reading historical fiction. Looking for someone who understands the demands of our profession but values quality time.",
  tags: ['Hiking', 'Classical Music', 'Vegetarian'],
  education: {
    degree: 'MD Cardiology',
    institution: 'AIIMS, New Delhi (Gold Medalist)'
  },
  career: {
    position: 'Senior Resident',
    institution: 'City Heart Institute',
    duration: '3 Yrs'
  },
  intelligence: {
    totalScore: 98,
    categories: [
        { name: 'Lifestyle & Values', score: 99, weight: 'High' },
        { name: 'Career Ambition', score: 95, weight: 'High' },
        { name: 'Family Background', score: 90, weight: 'Medium' }
    ],
    mutualFit: { youMeetThem: 95, theyMeetYou: 100 },
    topReasons: ['Both prioritize research', 'Vegetarian diets align', 'Complementary work schedules'],
    frictionPoints: ['Dr. Aditi prefers city living, you prefer suburbs'],
    agentNotes: 'Highly recommended. Families have spoken and aligned on horoscope as well.',
    generatedAt: 'AI Analysis • 2 hours ago'
  }
};

export const SECONDARY_PROFILE: Partial<ProfileMatch> = {
  name: 'Dr. Rohan Gupta, MS Ortho',
  specialty: 'Spine Specialist • Apollo Hospital',
  matchPercentage: 85,
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRcdeTydgcgnAttlmfU4LLL4vVkwtOHBPd6w3QatUT9cIkbpP_DjfQ9RlvwlJBVXG53Yp1hle3KRcVrHPd95u3mGIknG4fv1yYu7jStC9WvKbCY45OIF04vYYeNPPn3YkTxz1U-5VYb-dWXPjBCCod00I1VgvOH-4ifIV3k6a6jxbnxbSX7R2dWfw2t5vzM82LqXfDWPd9vHmktScUf8EMP2g38LXuffLIFPolBtqNIpOmWEaC0EoQa_hZeTAMERlO-0iWiCGVOHs'
};

export const COMPATIBILITY_METRICS: CompatibilityMetric[] = [
  { label: 'Shift Compatibility', percentage: 88, color: 'primary' },
  { label: 'Research Interests', percentage: 92, color: 'primary' },
  { label: 'Lifestyle Goals', percentage: 74, color: 'yellow' },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'view', user: 'Dr. Raj Patel', time: '12 mins ago' },
  { id: '2', type: 'message', user: 'Dr. Emily Chen', message: '"Hello Dr. Kumar, I saw your research paper on..."', time: '1 hour ago', isNew: true },
  { id: '3', type: 'update', message: 'Profile visibility updated', time: 'Yesterday' },
];

export const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    participants: [{ name: 'Dr. Aditi Sharma', avatarUrl: MAIN_PROFILE.avatarUrl }],
    lastMessage: { id: 'm1', senderId: '1', text: 'That sounds perfect! Saturday works for me.', type: 'text', timestamp: '10:42 AM', status: 'read' },
    unreadCount: 0,
    type: 'direct',
    isOnline: true,
  },
  {
    id: '2',
    participants: [
        { name: 'Dr. Rohan Gupta', avatarUrl: SECONDARY_PROFILE.avatarUrl! },
        { name: 'Mrs. Gupta (Mother)', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200', role: 'Guardian' }
    ],
    lastMessage: { id: 'm2', senderId: '2', text: 'Shared a family photo album', type: 'system', timestamp: 'Yesterday', status: 'read' },
    unreadCount: 2,
    type: 'group',
  },
  {
    id: '3',
    participants: [{ name: 'Seema (Matchmaker)', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200', role: 'Agent' }],
    lastMessage: { id: 'm3', senderId: '3', text: 'Here are 3 new profiles for your review.', type: 'text', timestamp: 'Tue', status: 'read' },
    unreadCount: 0,
    type: 'matchmaker',
  },
  {
    id: '4',
    participants: [{ name: 'Dr. Emily Chen', avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200' }],
    lastMessage: { id: 'm4', senderId: '4', text: 'Hi Dr. Kumar, interesting profile!', type: 'text', timestamp: '1 hour ago', status: 'delivered' },
    unreadCount: 1,
    type: 'direct',
    isRequest: true,
  }
];
