import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import Card from '../components/Card';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import FooterContact from '../components/FooterContact';
import BackToTopButton from '../components/BackToTopButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const { t } = useTranslation(); // Initialize the useTranslation hook

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' }); // Reset form after submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Fetch contact info from translation.json
  const contactInfo = Array.isArray(t('contact.contactInfo', { returnObjects: true }))
    ? t('contact.contactInfo', { returnObjects: true })
    : []; // Fallback to an empty array if data is invalid

  // Debugging: Log contactInfo to ensure data is fetched correctly
  console.log(contactInfo);

  const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:Rakesh Mal
TEL:+91 7738431349
EMAIL:malrakesh172@gmail.com
ADR:;;Anand Nagar, Dahisar (East);Mumbai;Maharashtra;400068;India
END:VCARD
`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contact Us Title and Icon */}
        <div className="text-center mb-12">
          <MessageCircle
            className={`h-16 w-16 mx-auto mb-4 transition-transform transform ${
              isIconHovered ? 'scale-110 text-indigo-600' : 'text-indigo-600'
            }`}
            onMouseEnter={() => setIsIconHovered(true)}
            onMouseLeave={() => setIsIconHovered(false)}
          />
          <h1
            className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
              isTitleHovered ? 'text-indigo-600' : 'text-gray-900'
            }`}
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            {t('contact.header.title')}
          </h1>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            onMouseEnter={() => setIsTitleHovered(true)} // Trigger hover effect on "Contact Us" when hovering over description
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            {t('contact.header.description')}
          </p>
        </div>

        {/* Contact Information */}
        <div id="contact-info" className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {contactInfo.length > 0 ? (
              contactInfo.map((info, index) => (
                <Card key={index} className="p-6 transform hover:scale-105 transition-transform duration-300 border border-gray-300">
                  <div className="flex items-start space-x-4">
                    {info.icon === 'Mail' && <Mail className="h-6 w-6 text-indigo-600" />}
                    {info.icon === 'Phone' && <Phone className="h-6 w-6 text-indigo-600" />}
                    {info.icon === 'MapPin' && <MapPin className="h-6 w-6 text-indigo-600" />}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-600 text-center">No contact information available.</p>
            )}
          </div>

          {/* Map Section */}
          <div id="find-location" className="h-full">
            <Card className="p-6 border border-gray-300 h-full">
              <h2 className="text-2xl font-bold mb-4">{t('contact.mapSection.title')}</h2>
              <div className="relative w-full h-0 pb-[56.25%]"> {/* Responsive aspect ratio for the map */}
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.9251482573264!2d72.90958211517465!3d19.19125618690806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7982eecfd09%3A0x9bebdb8d67242485!2sAnand%20Nagar%20Dahisar!5e0!3m2!1sen!2sin!4v1634054825061!5m2!1sen!2sin"
                  className="absolute top-0 left-0 w-full h-full" // Full width and height within the container
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Card>
          </div>
        </div>

        {/* Scan to Save Contact */}
        <div id="save-contact" className="mt-12">
          <Card className="p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-4">{t('contact.qrCodeSection.title')}</h2>
            <div className="flex justify-center">
              <QRCodeCanvas
                value={vCardData}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-center text-gray-600 mt-4">
              {t('contact.qrCodeSection.description')}
            </p>
          </Card>
        </div>

        {/* Contact Form */}
        <div id="send-message" className="mt-12">
          <Card className="p-6 border border-gray-300">
            <h2 className="text-2xl font-bold mb-4">{t('contact.formSection.title')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="name">
                  {t('contact.formSection.labels.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="email">
                  {t('contact.formSection.labels.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="message">
                  {t('contact.formSection.labels.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={5}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition duration-200"
              >
                <Send className="mr-2 h-4 w-4" />
                {t('contact.formSection.button')}
              </button>
            </form>
          </Card>
        </div>
      </div>
      <BackToTopButton />
      <FooterContact />
    </div>
  );
};

export default Contact;