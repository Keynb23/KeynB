import BetterState1 from '../../assets/BetterStateMo/BetterState1.png';
import BetterState2 from '../../assets/BetterStateMo/BetterState2.png';
import BetterState3 from '../../assets/BetterStateMo/BetterState3.png';
import BetterState4 from '../../assets/BetterStateMo/BetterState4.png';
import BetterState5 from '../../assets/BetterStateMo/BetterState5.png';
import BetterState6 from '../../assets/BetterStateMo/BetterState6.png';
import BetterState7 from '../../assets/BetterStateMo/BetterState7.png';
import BetterState8 from '../../assets/BetterStateMo/BetterState8.png';
import BetterState9 from '../../assets/BetterStateMo/BetterState9.png';
import BetterStateVid from '../../assets/BetterStateMo/BetterStateVideo.mp4';

// Export a single, self-contained project object
export const BetterState = {
  id: 8, // A unique ID
  title: 'Better State Mo LLC ',
  summary: 'Independently redesigned and developed the public-facing website for a pool cleaning business in Missouri, transforming a previously confusing site into a clean, modern, and accessible interface for all age groups.',
  coverImage: BetterState1, // The main image for the card
  tags: ['React', 'JSX', 'CSS'],
  // All the media for the detailed view/modal
  media: [
    { type: 'image', src: BetterState1 },
    { type: 'image', src: BetterState2 },
    { type: 'image', src: BetterState3 },
    { type: 'image', src: BetterState4 },
    { type: 'image', src: BetterState5 },
    { type: 'image', src: BetterState6 },
    { type: 'image', src: BetterState7 },
    { type: 'image', src: BetterState8 },
    { type: 'image', src: BetterState9 },
    { type: 'video', src: BetterStateVid },
  ],
  // Any other detailed info
};