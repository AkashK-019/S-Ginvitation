const WEDDING_CONFIG = {

  couple: {
    groom: {
      firstName: "Gaurav",
      fullName: "Gaurav Chandulal Kapare",
      parents: "Son of Smt. Trupti & Shri Chandulal Pandit Kapare",
      grandparents: ""
    },
    bride: {
      firstName: "Swarda",
      fullName: "Swarda Prashant Parab",
      parents: "Daughter of Smt. Sharvari & Shri Prashant Ramchandra Parab",
      grandparents: ""
    },
    monogram: "G & S",
    title: "गौरव व स्वरदा",
    invocation: "॥ श्री गणेशाय नमः ॥",
    shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    tagline: "आमच्या शुभविवाह सोहळ्यास आपण सहकुटुंब उपस्थित राहावे, ही सप्रेम विनंती."
  },

  date: {
    displayDate: "शनिवार, ५ डिसेंबर २०२६",
    muhurat: "विवाहाचा शुभमुहूर्त: सकाळी १०:२६ वाजता",
    dayNum: "5",
    monthName: "डिसेंबर",
    year: "2026",
    isoDateTime: "2026-12-05T10:26:00",
    timezone: "Asia/Kolkata",
    rsvpDeadline: "२० नोव्हेंबर २०२६"
  },

  venue: {
    name: "D' Rajwada Resort & Banquet Hall",
    city: "Boisar, Palghar",
    hall: "Banquet Hall & Lawns",
    address: "Chillar Road, Opposite MIDC Water Filtration Plant, Village Gundale, Boisar, District Palghar, Maharashtra – 401501, India.",
    googleMapsUrl: "https://maps.app.goo.gl/kcUykWanh9s5THDq9",
    appleMapsUrl: "https://maps.app.goo.gl/kcUykWanh9s5THDq9"
  },

  itinerary: [
    {
      title: "शुभविवाह मुहूर्त",
      date: "शनिवार, ५ डिसेंबर २०२६ · सकाळी १०:२६ वाजता",
      location: "D' Rajwada Resort & Banquet Hall, Boisar",
      dressCode: "पारंपरिक पोशाख",
      colors: ["#631622", "#D4AF37", "#FAF7F2", "#8B1E2F"],
      desc: "पवित्र मंगलाष्टके, सप्तपदी आणि नवदांपत्यास शुभाशिर्वाद."
    },
    {
      title: "स्नेहभोजन",
      date: "शनिवार, ५ डिसेंबर २०२६ · दुपारी १२:३० ते ३:३० वाजेपर्यंत",
      location: "D' Rajwada Dining Hall & Lawns",
      dressCode: "पारंपरिक पोशाख",
      colors: ["#631622", "#D4AF37", "#FAF7F2"],
      desc: "आमंत्रित आप्तेष्टांसाठी स्नेहभोजनाचे आयोजन केले आहे."
    }
  ],

};

if (typeof window !== "undefined") {
  window.WEDDING_CONFIG = WEDDING_CONFIG;
}