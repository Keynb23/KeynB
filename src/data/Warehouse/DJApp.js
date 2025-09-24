// src/data/Warehouse/DJApp.js

import MyDJApp from '../../assets/DJApp//MyDJapp.png';
import DJAppVid from '../../assets/DJApp/DJAppVid.mp4';

// Export a single, self-contained project object
export const DJApp = {
  id: 8, // A unique ID
  title: 'My Daily Journal App ',
  summary: 'Created an app to track my dialy progress on my tech journey',
  links: 'https://djapp-beryl.vercel.app/',
  source: 'https://github.com/Keynb23/WebJournal',
  coverImage: MyDJApp, // The main image for the card
  tags: ['HTML', 'JavaScript', 'CSS'],
  // All the media for the detailed view/modal
  media: [
    { type: 'image', src: MyDJApp },
    { type: 'video', src: DJAppVid },
  ],
  // Any other detailed info
};