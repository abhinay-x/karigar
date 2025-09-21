import React, { createContext, useContext, useState, useEffect } from 'react';

// Language translations
const translations = {
  en: {
    // Signup
    signup: 'Sign Up',
    createAccount: 'Create Account',
    joinKalaAI: 'Join KalaAI',
    accountSetup: 'Account Setup',
    personalInformation: 'Personal Information',
    craftInformation: 'Craft Information',
    accountSecurity: 'Account Security',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    craftType: 'Craft Type',
    yearsOfExperience: 'Years of Experience',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    creatingAccount: 'Creating Account...',
    newToKalaAI: 'New to KalaAI?',
    wantToExplore: 'Want to explore first?',
    tryFeatures: 'Try all features with demo mode - no signup required',
    selectYourCraft: 'Select your craft',
    selectExperience: 'Select experience',
    backToHome: 'Back to Home',
    createYourAccount: 'Create Your Account',
    tryDemoFirst: 'Try Demo First',
    
    // Home Page
    heroTitle: 'Empower Your Craft with AI',
    heroSubtitle: 'KalaAI bridges the gap between traditional craftsmanship and modern digital commerce. Preserve your cultural heritage while reaching global audiences with AI-powered tools.',
    startJourney: 'Start Your Journey',
    tryDemo: 'Try Demo Now',
    
    // Features
    aiPoweredContent: 'AI-Powered Content',
    aiContentDesc: 'Generate compelling product descriptions, stories, and social media content in multiple languages.',
    globalMarketplace: 'Global Marketplace',
    globalMarketplaceDesc: 'Connect with customers worldwide while preserving your cultural heritage and craft traditions.',
    artisanCommunity: 'Artisan Community',
    artisanCommunityDesc: 'Join a thriving community of traditional craftspeople embracing digital transformation.',
    businessGrowth: 'Business Growth',
    businessGrowthDesc: 'Increase your income by 50% through direct sales and enhanced digital presence.',
    
    // Dashboard
    totalSales: 'Total Sales',
    thisMonth: 'This Month',
    totalProducts: 'Total Products',
    activeProducts: 'Active Products',
    totalCustomers: 'Total Customers',
    customerRating: 'Customer Rating',
    digitalScore: 'Digital Score',
    
    // Products
    addProduct: 'Add Product',
    productName: 'Product Name',
    category: 'Category',
    price: 'Price',
    description: 'Description',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    
    // Onboarding
    welcome: 'Welcome to KalaAI',
    personalInfo: 'Personal Information',
    craftDetails: 'Craft Details',
    businessGoals: 'Business Goals',
    name: 'Name',
    age: 'Age',
    location: 'Location',
    primaryCraft: 'Primary Craft',
    experience: 'Years of Experience',
    specialization: 'Specialization'
  },
  
  hi: {
    // Signup
    signup: 'साइन अप',
    createAccount: 'खाता बनाएं',
    joinKalaAI: 'कलाAI में शामिल हों',
    accountSetup: 'खाता सेटअप',
    personalInformation: 'व्यक्तिगत जानकारी',
    craftInformation: 'शिल्प जानकारी',
    accountSecurity: 'खाता सुरक्षा',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    phoneNumber: 'फोन नंबर',
    craftType: 'शिल्प प्रकार',
    yearsOfExperience: 'अनुभव के वर्ष',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    creatingAccount: 'खाता बनाया जा रहा है...',
    newToKalaAI: 'कलाAI में नए हैं?',
    wantToExplore: 'पहले एक्सप्लोर करना चाहते हैं?',
    tryFeatures: 'डेमो मोड के साथ सभी फीचर्स ट्राई करें - साइनअप की आवश्यकता नहीं',
    selectYourCraft: 'अपना शिल्प चुनें',
    selectExperience: 'अनुभव चुनें',
    backToHome: 'होम पर वापस जाएं',
    createYourAccount: 'अपना खाता बनाएं',
    tryDemoFirst: 'पहले डेमो ट्राई करें',
    
    // Home Page
    heroTitle: 'AI के साथ अपने शिल्प को सशक्त बनाएं',
    heroSubtitle: 'कलाAI पारंपरिक शिल्पकारी और आधुनिक डिजिटल वाणिज्य के बीच की खाई को पाटता है। AI-संचालित उपकरणों के साथ वैश्विक दर्शकों तक पहुंचते हुए अपनी सांस्कृतिक विरासत को संरक्षित करें।',
    startJourney: 'अपनी यात्रा शुरू करें',
    tryDemo: 'डेमो आज़माएं',
    
    // Features
    aiPoweredContent: 'AI-संचालित सामग्री',
    aiContentDesc: 'कई भाषाओं में आकर्षक उत्पाद विवरण, कहानियां और सोशल मीडिया सामग्री उत्पन्न करें।',
    globalMarketplace: 'वैश्विक बाज़ार',
    globalMarketplaceDesc: 'अपनी सांस्कृतिक विरासत और शिल्प परंपराओं को संरक्षित करते हुए दुनिया भर के ग्राहकों से जुड़ें।',
    artisanCommunity: 'शिल्पकार समुदाय',
    artisanCommunityDesc: 'डिजिटल परिवर्तन को अपनाने वाले पारंपरिक शिल्पकारों के एक संपन्न समुदाय में शामिल हों।',
    businessGrowth: 'व्यापार वृद्धि',
    businessGrowthDesc: 'प्रत्यक्ष बिक्री और बेहतर डिजिटल उपस्थिति के माध्यम से अपनी आय में 50% की वृद्धि करें।',
    
    // Dashboard
    totalSales: 'कुल बिक्री',
    thisMonth: 'इस महीने',
    totalProducts: 'कुल उत्पाद',
    activeProducts: 'सक्रिय उत्पाद',
    totalCustomers: 'कुल ग्राहक',
    customerRating: 'ग्राहक रेटिंग',
    digitalScore: 'डिजिटल स्कोर',
    
    // Products
    addProduct: 'उत्पाद जोड़ें',
    productName: 'उत्पाद का नाम',
    category: 'श्रेणी',
    price: 'मूल्य',
    description: 'विवरण',
    
    // Common
    save: 'सेव करें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    loading: 'लोड हो रहा है...',
    success: 'सफलता',
    error: 'त्रुटि',
    
    // Onboarding
    welcome: 'कलाAI में आपका स्वागत है',
    personalInfo: 'व्यक्तिगत जानकारी',
    craftDetails: 'शिल्प विवरण',
    businessGoals: 'व्यापारिक लक्ष्य',
    name: 'नाम',
    age: 'आयु',
    location: 'स्थान',
    primaryCraft: 'मुख्य शिल्प',
    experience: 'अनुभव के वर्ष',
    specialization: 'विशेषज्ञता'
  },
  
  bn: {
    // Signup
    signup: 'সাইন আপ',
    createAccount: 'অ্যাকাউন্ট তৈরি করুন',
    joinKalaAI: 'কলাAI-এ যোগ দিন',
    accountSetup: 'অ্যাকাউন্ট সেটআপ',
    personalInformation: 'ব্যক্তিগত তথ্য',
    craftInformation: 'কারুশিল্পের তথ্য',
    accountSecurity: 'অ্যাকাউন্ট নিরাপত্তা',
    fullName: 'পুরো নাম',
    emailAddress: 'ইমেল ঠিকানা',
    phoneNumber: 'ফোন নম্বর',
    craftType: 'কারুশিল্পের ধরন',
    yearsOfExperience: 'অভিজ্ঞতার বছর',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    creatingAccount: 'অ্যাকাউন্ট তৈরি করা হচ্ছে...',
    newToKalaAI: 'কলাAI-এ নতুন?',
    wantToExplore: 'প্রথমে এক্সপ্লোর করতে চান?',
    tryFeatures: 'ডেমো মোড দিয়ে সব ফিচার চেষ্টা করুন - সাইনআপের প্রয়োজন নেই',
    selectYourCraft: 'আপনার কারুশিল্প নির্বাচন করুন',
    selectExperience: 'অভিজ্ঞতা নির্বাচন করুন',
    backToHome: 'হোমে ফিরুন',
    createYourAccount: 'আপনার অ্যাকাউন্ট তৈরি করুন',
    tryDemoFirst: 'প্রথমে ডেমো চেষ্টা করুন',
    
    // Home Page
    heroTitle: 'AI দিয়ে আপনার কারুশিল্পকে ক্ষমতায়ন করুন',
    heroSubtitle: 'কলাAI ঐতিহ্যবাহী কারুশিল্প এবং আধুনিক ডিজিটাল বাণিজ্যের মধ্যে ব্যবধান পূরণ করে। AI-চালিত সরঞ্জামের সাথে বিশ্বব্যাপী দর্শকদের কাছে পৌঁছানোর সময় আপনার সাংস্কৃতিক ঐতিহ্য সংরক্ষণ করুন।',
    startJourney: 'আপনার যাত্রা শুরু করুন',
    tryDemo: 'ডেমো চেষ্টা করুন',
    
    // Features
    aiPoweredContent: 'AI-চালিত বিষয়বস্তু',
    aiContentDesc: 'একাধিক ভাষায় আকর্ষণীয় পণ্যের বিবরণ, গল্প এবং সোশ্যাল মিডিয়া বিষয়বস্তু তৈরি করুন।',
    globalMarketplace: 'বিশ্বব্যাপী বাজার',
    globalMarketplaceDesc: 'আপনার সাংস্কৃতিক ঐতিহ্য এবং কারুশিল্প ঐতিহ্য সংরক্ষণ করার সময় বিশ্বব্যাপী গ্রাহকদের সাথে সংযোগ করুন।',
    artisanCommunity: 'কারিগর সম্প্রদায়',
    artisanCommunityDesc: 'ডিজিটাল রূপান্তর গ্রহণকারী ঐতিহ্যবাহী কারিগরদের একটি সমৃদ্ধ সম্প্রদায়ে যোগ দিন।',
    businessGrowth: 'ব্যবসায়িক বৃদ্ধি',
    businessGrowthDesc: 'প্রত্যক্ষ বিক্রয় এবং উন্নত ডিজিটাল উপস্থিতির মাধ্যমে আপনার আয় 50% বৃদ্ধি করুন।',
    
    // Dashboard
    totalSales: 'মোট বিক্রয়',
    thisMonth: 'এই মাসে',
    totalProducts: 'মোট পণ্য',
    activeProducts: 'সক্রিয় পণ্য',
    totalCustomers: 'মোট গ্রাহক',
    customerRating: 'গ্রাহক রেটিং',
    digitalScore: 'ডিজিটাল স্কোর',
    
    // Products
    addProduct: 'পণ্য যোগ করুন',
    productName: 'পণ্যের নাম',
    category: 'বিভাগ',
    price: 'মূল্য',
    description: 'বিবরণ',
    
    // Common
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    loading: 'লোড হচ্ছে...',
    success: 'সফলতা',
    error: 'ত্রুটি',
    
    // Onboarding
    welcome: 'কলাAI-তে স্বাগতম',
    personalInfo: 'ব্যক্তিগত তথ্য',
    craftDetails: 'কারুশিল্পের বিবরণ',
    businessGoals: 'ব্যবসায়িক লক্ষ্য',
    name: 'নাম',
    age: 'বয়স',
    location: 'অবস্থান',
    primaryCraft: 'প্রাথমিক কারুশিল্প',
    experience: 'অভিজ্ঞতার বছর',
    specialization: 'বিশেষত্ব'
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('kalaai-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      setIsRTL(['ar', 'ur'].includes(savedLanguage)); // Add RTL languages if needed
    }
  }, []);

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
      setIsRTL(['ar', 'ur'].includes(languageCode));
      localStorage.setItem('kalaai-language', languageCode);
      
      // Update document direction
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key; // Fallback to key if translation not found
  };

  const getAvailableLanguages = () => [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
  ];

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    isRTL,
    getAvailableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
