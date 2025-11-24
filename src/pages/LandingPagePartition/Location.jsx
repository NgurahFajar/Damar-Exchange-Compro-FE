import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Single location data
const location = {
  name: "Damar Artha Abadi Money Changer",
  address: "Jl. Raya Pererenan Tanah Lot No.99, Pererenan, Kec. Mengwi, Kabupaten Badung, Bali 80351",
  hoursKey: "monday_to_sunday",
  phone: "6281338407237",
  displayPhone: "081338407237",
  mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.611838965092!2d115.13679249999998!3d-8.6332107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd239a33371e2e3%3A0x39ece2567f92eac6!2sDamar%20Artha%20Abadi%20Money%20Changer!5e0!3m2!1sid!2sid!4v1735600434839!5m2!1sid!2sid"
};

const animations = {
  container: {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.07, delayChildren: 0.02 }
      }
  },
  fadeInScale: {
      hidden: {
          opacity: 0,
          scale: 0.985,
          willChange: 'transform, opacity'
      },
      visible: {
          opacity: 1,
          scale: 1,
          transition: {
              duration: 0.35,
              ease: 'easeOut'
          }
      }
  }
};
// Style utilities matching About.jsx
const useStyles = (isDark) => useMemo(() => ({
  mainText: isDark ? 'text-white' : 'text-gray-900',
  subText: isDark ? 'text-gray-300' : 'text-gray-700'
}), [isDark]);

// Memoized InfoCard component
const InfoCard = memo(({ icon: Icon, title, content, onClick, isDark }) => {
  const styles = useStyles(isDark);

  return (
      <motion.div
          variants={animations.fadeInScale}
          className="p-6 rounded-xl backdrop-blur-lg bg-gradient-to-br from-transparent to-orange-700/5 cursor-pointer transition-all duration-300"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          onClick={onClick}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-600/90 flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 font-poppins">
            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${styles.mainText}`}>{title}</h3>
            <p className={`${styles.subText} text-sm md:text-base`}>{content}</p>
          </div>
        </div>
      </motion.div>
  );
});

// Memoized map component
const LocationMap = memo(({ mapSrc }) => (
    <div className="h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-xl">
      <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-xl"
          title="Damar Money Changer Location"
      />
    </div>
));

const Location = memo(({ isDark }) => {
  const { t } = useTranslation();
  const styles = useStyles(isDark);

  return (
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
            variants={animations.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-6 mb-8"
        >
          <motion.div
              variants={animations.fadeInScale}
              className="rounded-2xl p-8 lg:p-10 shadow-xl relative overflow-hidden backdrop-blur-lg"
          >
            {/* Decorative Background Elements */}
            <div className="absolute -right-40 top-0 w-40 h-40 rounded-full bg-orange-600/5 blur-3xl"/>
            <div className="absolute -left-40 bottom-0 w-40 h-40 rounded-full bg-purple-600/5 blur-3xl"/>

            <div className="relative space-y-8">
              <div className="flex flex-col items-center justify-center text-center font-poppins gap-4 mb-8">
                <h2 className={`text-2xl sm:text-3xl font-bold ${styles.mainText}`}
                    dangerouslySetInnerHTML={{
                      __html: t('damarExchangeTitle', {
                        exchange: '<span class="text-[#DC5233]">Exchange</span>'
                      })
                    }}
                />
                <p className={`${styles.subText} text-base md:text-lg max-w-2xl`}>
                  {t('location_description')}
                </p>
              </div>

              {/* Rest of the component remains the same */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={animations.fadeInScale}>
              
                  <LocationMap mapSrc={location.mapSrc}/>
                </motion.div>

                <motion.div className="space-y-6">
                  <InfoCard
                      icon={MapPin}
                      title={location.name}
                      content={location.address}
                      onClick={() => window.location.href = `https://maps.app.goo.gl/WB7PBzQh4oDDSfQt9`}
                      isDark={isDark}
                  />
                  <InfoCard
                      icon={Clock}
                      title={t('operational_hours')}
                      content={t(`hours.${location.hoursKey}`)}
                      isDark={isDark}
                  />
                  <InfoCard
                      icon={Phone}
                      title={t("contact")}
                      content={location.displayPhone}
                      onClick={() => window.location.href = `https://wa.me/${location.phone}`}
                      isDark={isDark}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
  );
});
// Add display names for debugging
InfoCard.displayName = 'InfoCard';
LocationMap.displayName = 'LocationMap';
Location.displayName = 'Location';

export default Location;
