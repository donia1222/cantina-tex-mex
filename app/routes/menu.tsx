// app/routes/Menu.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { X, Leaf, Flame, Baby, IceCream, Diff } from 'lucide-react';
import AnimatedGradientText from '~/components/AnimatedGradientText'; // Asegúrate de que la ruta sea correcta

import HeaderSpe from '~/components/HeaderSpe'; 

const menuSections = [
  { id: 'vorspeisen', name: 'Vorspeisen', color: '#FF6B6B', icon: <Diff size={32} />, image: 'https://cantinatexmex.ch/images/2022/03/13/3_copia-1-copia.jpg' },
  { id: 'texas', name: 'Texas', color: '#4ECDC4', icon: <Diff size={32} />, image: 'https://cantinatexmex.ch/images/2023/02/24/3_copia-11.jpg' },
  { id: 'mexico', name: 'Mexico', color: '#45B7D1', icon: <Diff size={32} />, image: 'https://cantinatexmex.ch/images/2022/03/13/3_copia-11.jpg' },
  { id: 'kinder', name: 'Kinder', color: '#FFA07A', icon: <Diff size={32} />, image: 'https://cantinatexmex.ch/images/2022/07/16/pexels-alleksana-6400028-2.jpg' },
  { id: 'desserts', name: 'Desserts', color: '#C06C84', icon: <Diff size={32} />, image: 'https://cantinatexmex.ch/images/2022/03/13/3_copia-14.jpg' },
  { id: 'bebidas', name: 'Bebidas', color: '#FFD700', icon: <Diff size={32} />, image: 'https://cantinatexmex.ch/images/2022/03/06/40867849_l1.jpg' }, // Nueva sección
] as const;

type SectionId = typeof menuSections[number]['id'];

type SubMenuItem = {
  name: string;
  description: string;
};

type MenuItem = {
  name: string;
  price?: number; // Precio opcional
  description?: string;
  subItems?: SubMenuItem[]; // Subcategorías opcionales
  vegi?: boolean;
};

type MenuData = Record<SectionId, MenuItem[]>;

export const loader: LoaderFunction = async () => {
  const menuItems: MenuData = {
    vorspeisen: [
      { name: 'Chips mit Sauce', price: 8.50, description: 'Weizen Chips mit Guacamole und Salsa', vegi: true },
      { name: 'Onion Rings', price: 10.50, description: 'Frittierte Zwiebelringe, dazu Salsa und Sour Cream', vegi: true },
      { name: 'Sopa de maiz con Chili', price: 9.50, description: 'Maissuppe, serviert mit einem pikanten Red Chili Popper', vegi: true },
      { name: 'Grüner Salat', price: 8.00, description: 'Verschiedene knackige Blattsalate mit Brotcroûtons', vegi: true },
      { name: 'Gemischter Salat', price: 9.50, description: 'Gemischte Salate mit Avocadostreifen', vegi: true },
      { name: 'Nachos mit Cheese', price: 10.50, description: 'Mais Chips mit Salsa und Sour Cream mit Mozzarella und Cheddar Cheese überbacken', vegi: true },
      { name: 'The Real Caesar Salad', price: 13.50, description: 'Eisbergsalat mit Parmesan, Brotcroûtons, Ceasar Sauce und knusprigen Speckwürfeli' },
      { name: 'Salat "Cantina"', price: 15.00, description: 'Grosser gemischter Salat mit Pouletstreifen Onion Rings und Tortilla Chips' },
      { name: 'Macho Nachos', price: 15.50, description: 'Mais Chips mit hausgemachtem Chili con Carne mit Mozzarella und Cheddar Cheese überbacken' },
      { name: 'Gambas al ajillo', price: 15.50, description: 'Sautierte Crevetten mit Knoblauch und Olivenöl flambiert mit Brandy' },
      { name: 'Mexikanische Vorspeisenplatte', price: 16.50, description: 'Nachos, Quesadilla, Guacamole, Onion Rings, Chicken Fingers, Crevetten (ab 2 Personen, Preis pro Person)' },
      { name: 'Chips-Chicken Fingers', price: 12.50, description: '6 Stück Hausgemachte, knusprige Pouletstreifen mit Tortilla-Chips Panade Mozzarella Sticks' },
    ],
    texas: [
      { name: 'Baked Potatoes', price: 20.50, description: 'Kartoffelscheiben gemischt mit verschiedenen Gemüsen goldbraun überbacken mit Mozzarella und Cheddar', vegi: true },
      { name: 'Chicken Potatoes', price: 25.50, description: 'Kartoffelscheiben gemischt mit knackigem Broccoli und gebratenen Pouletstreifen, mit Mozzarella und Cheddar Cheese goldbraun überbacken' },
      { name: 'Shrimps Potatoes', price: 25.50, description: 'Kartoffelscheiben gemischt mit Crevetten, Cherry Tomaten und Kräuter, gebratenen Pouletstreifen, mit Mozzarella und Cheddar Cheese goldbraun überbacken' },
      { name: 'Chicken Fingers', price: 26.50, description: 'Hausgemachte, knusprige Pouletstreifen mit Tortilla-Chips Panade dazu Pommes' },
      { name: 'Cantiworker', price: 24.50, description: '200 Gramm 100% Black Angus Rindfleisch. Mit Eisbergsalat, roten Zwiebeln, Cheddar Cheese, hausgemachter BBQ Sauce und…viel Liebe gefüllt' },
      { name: 'Cantina Spiess 250gr', price: 36.50, description: 'Saftiger gemischter Fleischspiess mit Country Fries und Knoblauchbrot, dazu Saucen zum Dippen' },
      { name: 'Rancher Steak 200gr', price: 37.50, description: 'Rindsentrecôte, gratiniert mit Kräuterbutter und Parmesan, dazu Pommes, Onion Rings und Saucen zum Dippen' },
    ],
    mexico: [
      { name: 'Fajitas', price: 28.50, description: 'Mit Pouletfleisch, Rindshuftwürfeli, Crevetten oder Gemüse' },
      { name: 'Quesadillas de Tomate y maiz', price: 18.50, description: 'Mit frischen Tomaten und Mais', vegi: true },
      { name: 'Quesadillas de Pollo', price: 21.50, description: 'Mit Pouletfleisch' },
      { name: 'Quesadillas de Chorizo', price: 22.50, description: 'Mit pikantem Chorizo' },
      { name: 'Quesadillas res y pimiento', price: 25.50, description: 'Mit Rindshuftwürfeli und Peperoni' },
      { name: 'Quesadillas mar y tierra', price: 25.50, description: 'Mit Crevetten und Broccoli' },
      { name: 'Burritos con verdura', price: 25.50, description: 'Grosse, gerollte Weizentortillas gefüllt mit frischem Gemüse, dazu Sour Cream und Salsa serviert mit Tomatenreis oder Salat', vegi: true },
      { name: 'Burritos con Pollo y Res', price: 26.50, description: 'Grosse, gerollte Weizentortillas gefüllt mit Mais, Paprika Poulet-/Rindfleisch, dazu Sour Cream und Salsa, serviert mit Tomatenreis oder Salat' },
      { name: 'Chili con Carne', price: 28.50, description: 'Rindfleisch mit Chili, frischen Tomaten, Mais und Kidneybohnen, serviert im Reisring' },
      { name: 'Enachiladas', price: 16.50, description: 'Pouletfleisch, Rindshuftwürfeli, Crevetten oder Gemüse' },
    ],
    kinder: [
      { name: 'Kalbswürstchen am Spiess', price: 12.50, description: 'Serviert mit Pommes' },
      { name: 'Chicken Fingers mit Pommes', price: 12.50, description: 'Hausgemachte, knusprige Pouletstreifen mit Tortilla-Chips Panade' },
      { name: 'Mini Burritos mit Pouletfleisch', price: 12.50, description: '' },
    ],
    desserts: [
      { name: 'Flan de Coco', price: 9.00, description: 'Kokos-Flan serviert mit frischer Ananas und Schlagrahm' },
      { name: 'Tarta de la casa', price: 9.50, description: 'Süsse Köstlichkeit nach Geheimrezept' },
      { name: 'Churros', price: 10.50, description: 'Serviert mit Glace und Schokoladensauce' },
      { name: 'Choco Banana', price: 9.50, description: '2 Kugeln Bananenglace mit heisser Schokoladensauce und Schlagrahm' },
      { name: 'Copa Silvestre', price: 9.50, description: 'Erdbeerglace, Vanilleglace, Merengue und heisse Beerensauce' },
      { name: 'Don Chocolate', price: 10.50, description: 'Schokoladenglace, Moccaglace, Tobleronestückchen und Schlagrahm' },
      { name: 'Mexican Coffee', price: 12.50, description: 'Kaffeeglace gemischt mit heissem Espresso, Kahlúa Likör und Schlagrahm' },
    ],
    bebidas: [
      // Cocktails mit Alkohol
      { name: 'Cocktails mit Alkohol', description: 'Sex on the Beach, Margarita, Caipirinha, Mojito, Piña Colada, Tequila Sunrise, Pitufa...', price: undefined },
      // Alkoholfreie Cocktails
      { name: 'Alkoholfreie Cocktails', description: 'Caipirohne, Stress Killer, Malibu Dreams, Pitufo, Santa Fresana...', price: undefined },
    ],
  };

  return json(menuItems);
};

export default function Menu() {
  const menuItems = useLoaderData<MenuData>();
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  const handleSectionClick = (sectionId: SectionId) => {
    setActiveSection(sectionId);
  };

  const closeModal = () => {
    setActiveSection(null);
  };

  // Variants para las animaciones de entrada de las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' },
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start font-poppins  bg-gray-900 bg-opacity-70 rounded-lg">


      <HeaderSpe />
      <motion.div
        className="w-full max-w-6xl px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {menuSections.map((section) => (
          <motion.div
            key={section.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            variants={cardVariants}
            whileHover="hover"
            onClick={() => handleSectionClick(section.id)}
          >
            <div className="relative">
              <img
                src={section.image}
                alt={section.name}
                className="w-full h-48 object-cover opacity-90 transition-opacity duration-300"
              />
              {/* Overlay de gradiente al hacer hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-t-lg"></div>
              
              {/* Contenedor del texto y el icono con fondo semi-transparente */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded p-2 text-white">
                <div className="flex items-center space-x-2">
                  <span>{section.icon}</span>
                  <h2 className="text-xl font-semibold">{section.name}</h2>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>


      {/* Modal de sección activa */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-20"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg overflow-hidden max-w-2xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 overflow-hidden ">
                <img
                  src={menuSections.find((s) => s.id === activeSection)?.image}
                  alt={menuSections.find((s) => s.id === activeSection)?.name}
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <h2 className="absolute bottom-4 left-4 text-3xl font-bold text-white">
                  {menuSections.find((s) => s.id === activeSection)?.name}
                </h2>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(80vh-12rem)] p-6">
                <div className="grid gap-6">
                  {menuItems[activeSection].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-100 rounded-lg shadow-md p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-red-700">{item.name}</h3>
                        {item.price !== undefined && (
                          <span className="text-lg font-bold text-green-600">CHF {item.price.toFixed(2)}</span>
                        )}
                      </div>
                      {item.description && <p className="text-gray-600">{item.description}</p>}
                      {item.subItems && (
                        <ul className="list-disc list-inside mt-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.name} className="text-gray-600">
                              {subItem.name} {subItem.description && `- ${subItem.description}`}
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.vegi && (
                        <span className="mt-2 inline-block bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Vegi
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
