/**
 * Triggers the automatic generation and download of an industry-standard .vcf file.
 * Compatible directly with iOS Contacts and Android Google Contacts.
 */
function downloadVCard() {
  const contact = {
    name: "xyz",
    title: "xyz",
    company: "xyz",
    phone: "+919999999999",
    email: "cxy@example.com",
    website: "https://yourcompany.com"
  };

  const vcardData = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contact.name}`,
    `ORG:${contact.company}`,
    `TITLE:${contact.title}`,
    `TEL;TYPE=CELL:${contact.phone}`,
    `EMAIL:${contact.email}`,
    `URL:${contact.website}`,
    "END:VCARD"
  ].join("\n");

  const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.setAttribute("download", `${contact.name.replace(/\s+/g, "_")}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Invokes the smartphone native share sheet or falls back to copying the link.
 */
async function shareProfile() {
  const shareData = {
    title: "xyz - xyz",
    text: "Connect with Rahul Sharma, Lead Consultant at NEXUS",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // User cancelled share dialog
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Profile link copied to clipboard!");
  }
}