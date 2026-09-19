import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language } from './data';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  English: {
    appName: 'KisanSetu',
    dashboard: 'Dashboard',
    diagnosis: 'Crop Diagnosis',
    treatment: 'Treatment',
    market: 'Market',
    buyers: 'Buyers',
    storage: 'Storage',
    transport: 'Logistics',
    requests: 'Requests',
    profile: 'Profile',
    requirements: 'Requirements',
    farmerRequests: 'Farmer Requests',

    online: 'Online',
    offline: 'Offline',
    logout: 'Logout',
    account: 'Account',

    buyerProfile: 'Buyer Profile',
    businessInformation: 'Business Information',
    contactInformation: 'Contact Information',
    preferences: 'Preferences',

    name: 'Name',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    businessName: 'Business Name',
    buyerType: 'Buyer Type',
    preferredLanguage: 'Preferred Language',

    profilePhoto: 'Profile Photo',
    addPhoto: 'Add Photo',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove Photo',

    editProfile: 'Edit Profile',
    saveProfile: 'Save Profile',
    cancel: 'Cancel',
    notSet: 'Not set',

    buyer: 'Buyer',
    farmer: 'Farmer',
    business: 'Business',
    individualBuyer: 'Individual Buyer',
    fpo: 'FPO',

    profileSaved: 'Profile saved successfully',

    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    register: 'Register',
    login: 'Login',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    role: 'Role',

    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",

    getStarted: 'Get Started',
    learnMore: 'Learn More',
    welcome: 'Welcome to KisanSetu',

    buyerRole: 'Buyer',

    cropCare: 'Crop Care',
    directMarketAccess: 'Direct Market Access',
    connectFarmersBuyers: 'Connect farmers directly with buyers',

    viewDetails: 'View Details',
    viewAll: 'View All',
    submit: 'Submit',
    save: 'Save',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    search: 'Search',
    loading: 'Loading...',

    noData: 'No data available',
    success: 'Success',
    error: 'Error',

    quantity: 'Quantity',
    price: 'Price',
    crop: 'Crop',
    date: 'Date',
    status: 'Status',
    action: 'Action',

    accept: 'Accept',
    reject: 'Reject',
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',

    farmerDashboard: 'Farmer Dashboard',
    buyerDashboard: 'Buyer Dashboard',

    diagnoseCrop: 'Diagnose Your Crop',
    marketPrices: 'Market Prices',
    nearbyBuyers: 'Nearby Buyers',
    storageFacilities: 'Storage Facilities',
    transportServices: 'Transport Services',

    buyerRequirements: 'Buyer Requirements',
    farmerRequestsTitle: 'Farmer Requests',

    languageEnglish: 'English',
    languageTelugu: 'Telugu',
    languageHindi: 'Hindi',

    myProfile: 'My Profile',
manageBuyerInformation: 'Manage buyer information',
myRequirements: 'My Requirements',
manageProduceRequirements: 'Add and manage produce requirements',
viewRequestsFromFarmers: 'View requests from farmers',
welcomeBuyer: 'Welcome, Buyer!',
manageRequirementsAndRequests: 'Manage your requirements and farmer requests',
loggedInAs: 'Logged in as',
pendingRequest: 'Pending Request',
pendingRequests: 'Pending Requests',
open: 'Open',

reviewSellingRequests: 'Review selling requests from farmers',
noFarmerRequests: 'No farmer requests yet.',
farmerSellingRequest: 'Farmer Selling Request',
farmersMessage: "Farmer's message",
requestAcceptedMessage: 'You accepted this request. The farmer has been notified.',
requestRejectedMessage: 'You rejected this request.',

addRequirement: 'Add Requirement',
requirementAdded: 'Requirement added!',
addNewRequirement: 'Add New Requirement',
quantityRequired: 'Quantity Required (kg)',
priceOffered: 'Price Offered (₹/Quintal)',
contact: 'Contact',
noRequirements: "No requirements added. Click 'Add Requirement' to get started.",
remove: 'Remove',

manageBuyerProfile: 'Manage your business information and buyer preferences.',
editBuyerInformation: 'Edit Buyer Information',
updateProfileDetails: 'Update your profile, business and contact details.',
professionalPhoto: 'Add a professional photo to your buyer profile.',
photoLimit: 'JPG or PNG · Maximum 2 MB',
yourName: 'Your name',
yourBusinessName: 'Your business name',
yourCity: 'Your city',
validImage: 'Please select a valid image file.',
imageTooLarge: 'Please select an image smaller than 2 MB.',
buyerInformation: 'Your buyer and business details.',
communicationInformation: 'Information used for communication with farmers.',
customizeExperience: 'Customize your KisanSetu experience.',
profilePersonalize: 'Your profile information helps KisanSetu personalize your experience.',
personalInformation: 'Your personal information',
cropsGrown: 'Crops Grown',
cropExamples: 'e.g. Tomato, Rice, Chilli',
separateCrops: 'Separate multiple crops with commas',
},

  Telugu: {
    appName: 'కిసాన్ సేతు',
    dashboard: 'డాష్‌బోర్డ్',
    diagnosis: 'పంట నిర్ధారణ',
    treatment: 'చికిత్స',
    market: 'మార్కెట్',
    buyers: 'కొనుగోలుదారులు',
    storage: 'నిల్వ',
    transport: 'రవాణా',
    requests: 'అభ్యర్థనలు',
    profile: 'ప్రొఫైల్',
    requirements: 'అవసరాలు',
    farmerRequests: 'రైతు అభ్యర్థనలు',

    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    logout: 'లాగ్ అవుట్',
    account: 'ఖాతా',

    buyerProfile: 'కొనుగోలుదారు ప్రొఫైల్',
    businessInformation: 'వ్యాపార సమాచారం',
    contactInformation: 'సంప్రదింపు సమాచారం',
    preferences: 'ప్రాధాన్యతలు',

    name: 'పేరు',
    username: 'వినియోగదారు పేరు',
    email: 'ఈమెయిల్',
    phone: 'ఫోన్',
    location: 'ప్రాంతం',
    businessName: 'వ్యాపారం పేరు',
    buyerType: 'కొనుగోలుదారు రకం',
    preferredLanguage: 'ఇష్టమైన భాష',

    profilePhoto: 'ప్రొఫైల్ ఫోటో',
    addPhoto: 'ఫోటో జోడించండి',
    changePhoto: 'ఫోటో మార్చండి',
    removePhoto: 'ఫోటో తొలగించండి',

    editProfile: 'ప్రొఫైల్ మార్చండి',
    saveProfile: 'ప్రొఫైల్ సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    notSet: 'సెట్ చేయలేదు',

    buyer: 'కొనుగోలుదారు',
    farmer: 'రైతు',
    business: 'వ్యాపారం',
    individualBuyer: 'వ్యక్తిగత కొనుగోలుదారు',
    fpo: 'FPO',

    profileSaved: 'ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది',

    welcomeBack: 'స్వాగతం',
    createAccount: 'ఖాతా సృష్టించండి',
    register: 'రిజిస్టర్',
    login: 'లాగిన్',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    role: 'పాత్ర',

    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    dontHaveAccount: 'ఖాతా లేదా?',

    getStarted: 'ప్రారంభించండి',
    learnMore: 'మరింత తెలుసుకోండి',
    welcome: 'కిసాన్ సేతుకు స్వాగతం',

    buyerRole: 'కొనుగోలుదారు',

    cropCare: 'పంట సంరక్షణ',
    directMarketAccess: 'నేరుగా మార్కెట్‌కు',
    connectFarmersBuyers: 'రైతులను నేరుగా కొనుగోలుదారులతో కలుపుతుంది',

    viewDetails: 'వివరాలు చూడండి',
    viewAll: 'అన్నీ చూడండి',
    submit: 'సమర్పించండి',
    save: 'సేవ్ చేయండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    close: 'మూసివేయండి',
    search: 'వెతకండి',
    loading: 'లోడ్ అవుతోంది...',

    noData: 'సమాచారం అందుబాటులో లేదు',
    success: 'విజయం',
    error: 'లోపం',

    quantity: 'పరిమాణం',
    price: 'ధర',
    crop: 'పంట',
    date: 'తేదీ',
    status: 'స్థితి',
    action: 'చర్య',

    accept: 'అంగీకరించండి',
    reject: 'తిరస్కరించండి',
    pending: 'పెండింగ్',
    accepted: 'అంగీకరించబడింది',
    rejected: 'తిరస్కరించబడింది',

    farmerDashboard: 'రైతు డాష్‌బోర్డ్',
    buyerDashboard: 'కొనుగోలుదారు డాష్‌బోర్డ్',

    diagnoseCrop: 'మీ పంటను నిర్ధారించండి',
    marketPrices: 'మార్కెట్ ధరలు',
    nearbyBuyers: 'సమీపంలోని కొనుగోలుదారులు',
    storageFacilities: 'నిల్వ సౌకర్యాలు',
    transportServices: 'రవాణా సేవలు',

    buyerRequirements: 'కొనుగోలుదారు అవసరాలు',
    farmerRequestsTitle: 'రైతు అభ్యర్థనలు',

    languageEnglish: 'ఇంగ్లీష్',
    languageTelugu: 'తెలుగు',
    languageHindi: 'హిందీ',

    myProfile: 'నా ప్రొఫైల్',
manageBuyerInformation: 'కొనుగోలుదారు సమాచారాన్ని నిర్వహించండి',
myRequirements: 'నా అవసరాలు',
manageProduceRequirements: 'పంట అవసరాలను జోడించి నిర్వహించండి',
viewRequestsFromFarmers: 'రైతుల నుండి వచ్చిన అభ్యర్థనలను చూడండి',
welcomeBuyer: 'స్వాగతం, కొనుగోలుదారు!',
manageRequirementsAndRequests: 'మీ అవసరాలు మరియు రైతు అభ్యర్థనలను నిర్వహించండి',
loggedInAs: 'లాగిన్ అయినది',
pendingRequest: 'పెండింగ్ అభ్యర్థన',
pendingRequests: 'పెండింగ్ అభ్యర్థనలు',
open: 'తెరవండి',

reviewSellingRequests: 'రైతుల నుండి వచ్చిన విక్రయ అభ్యర్థనలను పరిశీలించండి',
noFarmerRequests: 'ఇంకా రైతు అభ్యర్థనలు లేవు.',
farmerSellingRequest: 'రైతు విక్రయ అభ్యర్థన',
farmersMessage: 'రైతు సందేశం',
requestAcceptedMessage: 'మీరు ఈ అభ్యర్థనను అంగీకరించారు. రైతుకు సమాచారం పంపబడింది.',
requestRejectedMessage: 'మీరు ఈ అభ్యర్థనను తిరస్కరించారు.',

addRequirement: 'అవసరాన్ని జోడించండి',
requirementAdded: 'అవసరం జోడించబడింది!',
addNewRequirement: 'కొత్త అవసరాన్ని జోడించండి',
quantityRequired: 'అవసరమైన పరిమాణం (కిలోలు)',
priceOffered: 'ఆఫర్ చేసిన ధర (₹/క్వింటాల్)',
contact: 'సంప్రదింపు',
noRequirements: 'ఇంకా అవసరాలు జోడించలేదు. ప్రారంభించడానికి "అవసరాన్ని జోడించండి" క్లిక్ చేయండి.',
remove: 'తొలగించండి',

manageBuyerProfile: 'మీ వ్యాపార సమాచారం మరియు కొనుగోలుదారు ప్రాధాన్యతలను నిర్వహించండి.',
editBuyerInformation: 'కొనుగోలుదారు సమాచారాన్ని మార్చండి',
updateProfileDetails: 'మీ ప్రొఫైల్, వ్యాపారం మరియు సంప్రదింపు వివరాలను మార్చండి.',
professionalPhoto: 'మీ కొనుగోలుదారు ప్రొఫైల్‌కు ప్రొఫెషనల్ ఫోటోను జోడించండి.',
photoLimit: 'JPG లేదా PNG · గరిష్టంగా 2 MB',
yourName: 'మీ పేరు',
yourBusinessName: 'మీ వ్యాపారం పేరు',
yourCity: 'మీ నగరం',
validImage: 'దయచేసి సరైన ఇమేజ్ ఫైల్‌ను ఎంచుకోండి.',
imageTooLarge: 'దయచేసి 2 MB కంటే చిన్న ఇమేజ్‌ను ఎంచుకోండి.',
buyerInformation: 'మీ కొనుగోలుదారు మరియు వ్యాపార వివరాలు.',
communicationInformation: 'రైతులతో కమ్యూనికేషన్ కోసం ఉపయోగించే సమాచారం.',
customizeExperience: 'మీ KisanSetu అనుభవాన్ని అనుకూలీకరించండి.',
profilePersonalize: 'మీ ప్రొఫైల్ సమాచారం KisanSetu మీ అనుభవాన్ని వ్యక్తిగతీకరించడంలో సహాయపడుతుంది.',
personalInformation: 'మీ వ్యక్తిగత సమాచారం',
cropsGrown: 'పండించే పంటలు',
cropExamples: 'ఉదా. టమాటా, వరి, మిరప',
separateCrops: 'ఒకటి కంటే ఎక్కువ పంటలను కామాలతో వేరు చేయండి',
},

  Hindi: {
    appName: 'किसान सेतु',
    dashboard: 'डैशबोर्ड',
    diagnosis: 'फसल निदान',
    treatment: 'उपचार',
    market: 'बाज़ार',
    buyers: 'खरीदार',
    storage: 'भंडारण',
    transport: 'लॉजिस्टिक्स',
    requests: 'अनुरोध',
    profile: 'प्रोफ़ाइल',
    requirements: 'आवश्यकताएँ',
    farmerRequests: 'किसान अनुरोध',

    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    logout: 'लॉग आउट',
    account: 'खाता',

    buyerProfile: 'खरीदार प्रोफ़ाइल',
    businessInformation: 'व्यावसायिक जानकारी',
    contactInformation: 'संपर्क जानकारी',
    preferences: 'प्राथमिकताएँ',

    name: 'नाम',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल',
    phone: 'फ़ोन',
    location: 'स्थान',
    businessName: 'व्यवसाय का नाम',
    buyerType: 'खरीदार का प्रकार',
    preferredLanguage: 'पसंदीदा भाषा',

    profilePhoto: 'प्रोफ़ाइल फ़ोटो',
    addPhoto: 'फ़ोटो जोड़ें',
    changePhoto: 'फ़ोटो बदलें',
    removePhoto: 'फ़ोटो हटाएँ',

    editProfile: 'प्रोफ़ाइल संपादित करें',
    saveProfile: 'प्रोफ़ाइल सहेजें',
    cancel: 'रद्द करें',
    notSet: 'सेट नहीं है',

    buyer: 'खरीदार',
    farmer: 'किसान',
    business: 'व्यवसाय',
    individualBuyer: 'व्यक्तिगत खरीदार',
    fpo: 'FPO',

    profileSaved: 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई',

    welcomeBack: 'वापसी पर स्वागत है',
    createAccount: 'खाता बनाएँ',
    register: 'रजिस्टर',
    login: 'लॉगिन',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    role: 'भूमिका',

    alreadyHaveAccount: 'पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',

    getStarted: 'शुरू करें',
    learnMore: 'और जानें',
    welcome: 'किसान सेतु में आपका स्वागत है',

    buyerRole: 'खरीदार',

    cropCare: 'फसल देखभाल',
    directMarketAccess: 'सीधे बाज़ार तक',
    connectFarmersBuyers: 'किसानों को सीधे खरीदारों से जोड़ें',

    viewDetails: 'विवरण देखें',
    viewAll: 'सभी देखें',
    submit: 'जमा करें',
    save: 'सहेजें',
    back: 'पीछे',
    next: 'अगला',
    close: 'बंद करें',
    search: 'खोजें',
    loading: 'लोड हो रहा है...',

    noData: 'कोई जानकारी उपलब्ध नहीं है',
    success: 'सफलता',
    error: 'त्रुटि',

    quantity: 'मात्रा',
    price: 'कीमत',
    crop: 'फसल',
    date: 'तारीख',
    status: 'स्थिति',
    action: 'कार्रवाई',

    accept: 'स्वीकार करें',
    reject: 'अस्वीकार करें',
    pending: 'लंबित',
    accepted: 'स्वीकृत',
    rejected: 'अस्वीकृत',

    farmerDashboard: 'किसान डैशबोर्ड',
    buyerDashboard: 'खरीदार डैशबोर्ड',

    diagnoseCrop: 'अपनी फसल का निदान करें',
    marketPrices: 'बाज़ार की कीमतें',
    nearbyBuyers: 'नज़दीकी खरीदार',
    storageFacilities: 'भंडारण सुविधाएँ',
    transportServices: 'परिवहन सेवाएँ',

    buyerRequirements: 'खरीदार की आवश्यकताएँ',
    farmerRequestsTitle: 'किसान अनुरोध',

    languageEnglish: 'अंग्रेज़ी',
    languageTelugu: 'तेलुगु',
    languageHindi: 'हिंदी',

    myProfile: 'मेरी प्रोफ़ाइल',
manageBuyerInformation: 'खरीदार की जानकारी प्रबंधित करें',
myRequirements: 'मेरी आवश्यकताएँ',
manageProduceRequirements: 'उत्पाद की आवश्यकताएँ जोड़ें और प्रबंधित करें',
viewRequestsFromFarmers: 'किसानों के अनुरोध देखें',
welcomeBuyer: 'स्वागत है, खरीदार!',
manageRequirementsAndRequests: 'अपनी आवश्यकताओं और किसान अनुरोधों को प्रबंधित करें',
loggedInAs: 'लॉगिन किया गया है',
pendingRequest: 'लंबित अनुरोध',
pendingRequests: 'लंबित अनुरोध',
open: 'खोलें',

reviewSellingRequests: 'किसानों के बिक्री अनुरोधों की समीक्षा करें',
noFarmerRequests: 'अभी कोई किसान अनुरोध नहीं है।',
farmerSellingRequest: 'किसान बिक्री अनुरोध',
farmersMessage: 'किसान का संदेश',
requestAcceptedMessage: 'आपने यह अनुरोध स्वीकार कर लिया है। किसान को सूचित कर दिया गया है।',
requestRejectedMessage: 'आपने यह अनुरोध अस्वीकार कर दिया है।',

addRequirement: 'आवश्यकता जोड़ें',
requirementAdded: 'आवश्यकता जोड़ दी गई!',
addNewRequirement: 'नई आवश्यकता जोड़ें',
quantityRequired: 'आवश्यक मात्रा (किलो)',
priceOffered: 'प्रस्तावित कीमत (₹/क्विंटल)',
contact: 'संपर्क',
noRequirements: 'अभी कोई आवश्यकता नहीं जोड़ी गई है। शुरू करने के लिए "आवश्यकता जोड़ें" पर क्लिक करें।',
remove: 'हटाएँ',

manageBuyerProfile: 'अपनी व्यावसायिक जानकारी और खरीदार प्राथमिकताओं को प्रबंधित करें।',
editBuyerInformation: 'खरीदार की जानकारी संपादित करें',
updateProfileDetails: 'अपनी प्रोफ़ाइल, व्यवसाय और संपर्क विवरण अपडेट करें।',
professionalPhoto: 'अपने खरीदार प्रोफ़ाइल में एक प्रोफ़ेशनल फोटो जोड़ें।',
photoLimit: 'JPG या PNG · अधिकतम 2 MB',
yourName: 'आपका नाम',
yourBusinessName: 'आपके व्यवसाय का नाम',
yourCity: 'आपका शहर',
validImage: 'कृपया एक मान्य इमेज फ़ाइल चुनें।',
imageTooLarge: 'कृपया 2 MB से छोटी इमेज चुनें।',
buyerInformation: 'आपके खरीदार और व्यवसाय के विवरण।',
communicationInformation: 'किसानों के साथ संपर्क के लिए उपयोग की जाने वाली जानकारी।',
customizeExperience: 'अपने KisanSetu अनुभव को अनुकूलित करें।',
profilePersonalize: 'आपकी प्रोफ़ाइल जानकारी KisanSetu को आपके अनुभव को व्यक्तिगत बनाने में मदद करती है।',
personalInformation: 'आपकी व्यक्तिगत जानकारी',
cropsGrown: 'उगाई जाने वाली फसलें',
cropExamples: 'जैसे टमाटर, चावल, मिर्च',
separateCrops: 'एक से अधिक फसलों को कॉमा से अलग करें', 
},
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kisansetu_language');

    if (saved === 'Telugu') {
      return 'Telugu';
    }

    if (saved === 'Hindi') {
      return 'Hindi';
    }

    return 'English';
  });

  function setLanguage(newLanguage: Language) {
    setLanguageState(newLanguage);
    localStorage.setItem('kisansetu_language', newLanguage);
  }

  useEffect(() => {
    localStorage.setItem('kisansetu_language', language);

    if (language === 'Telugu') {
      document.documentElement.lang = 'te';
    } else if (language === 'Hindi') {
      document.documentElement.lang = 'hi';
    } else {
      document.documentElement.lang = 'en';
    }
  }, [language]);

  function t(key: string): string {
    return translations[language][key] || translations.English[key] || key;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}