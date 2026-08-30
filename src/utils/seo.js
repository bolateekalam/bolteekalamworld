/**
 * 🚀 Bolatee Kalam (bolateeworld.in) — Dynamic SEO & Meta Updater Utility
 */

export const updatePageSEO = ({ title, description, canonicalUrl, ogImage }) => {
  const defaultDomain = 'https://www.bolateeworld.in';
  
  // 1. Update Document Title
  if (title) {
    document.title = `${title} — बोलती कलम (bolateeworld.in)`;
  } else {
    document.title = 'बोलती कलम | Bolatee Kalam (bolateeworld.in) — राष्ट्रीय डिजिटल साहित्यिक मंच';
  }

  // 2. Update Meta Description
  const defaultDesc = 'बोलती कलम (bolateeworld.in) - भारत का प्रमुख बहुभाषी डिजिटल साहित्यिक मंच। संस्थापक संजय राय के मार्गदर्शन में हिंदी कविताएँ, कहानियाँ, शायरी, ग़ज़ल पढ़ें और 6-माह नि:शुल्क सदस्यता कार्ड प्राप्त करें।';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description || defaultDesc);
  }

  // 3. Update Canonical URL
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', canonicalUrl || `${defaultDomain}${window.location.pathname}`);
  }

  // 4. Update OpenGraph Title & Image
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title ? `${title} — बोलती कलम` : 'बोलती कलम (bolateeworld.in) — भारत का बहुभाषी साहित्यिक मंच');
  }

  if (ogImage) {
    const ogImgMeta = document.querySelector('meta[property="og:image"]');
    if (ogImgMeta) ogImgMeta.setAttribute('content', ogImage);
  }
};
