import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

// Fallback slides if API fails
const FALLBACK_SLIDES = [
  {
    key: 'smart',
    num: '01',
    railTitle: 'What Is Cosmic\nPowertech',
    subtitle: 'Eco-Friendly Energy',
    title: ['Powering A Greener', 'Future With Solar'],
    body: 'Elit himenaeos risus blandit; sociosqu nulla suspendisse. Dignissim urna dapibus mollis efficitur pharetra varius congue.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-h1-slider-img-alt.jpg',
    icon: (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M34,62.1h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-6.9c0-0.4,0.3-0.7,0.7-0.7H34c0.4,0,0.7,0.3,0.7,0.7v6.9   C34.7,61.8,34.4,62.1,34,62.1z M27.9,60.7h5.4v-5.4h-5.4V60.7z"></path></g><g><path d="M59.1,62.1h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-6.9c0-0.4,0.3-0.7,0.7-0.7h6.9c0.4,0,0.7,0.3,0.7,0.7v6.9   C59.8,61.8,59.5,62.1,59.1,62.1z M53,60.7h5.4v-5.4H53V60.7z"></path></g><g><path d="M47.7,69c-0.4,0-0.7-0.3-0.7-0.7V57.6h-7.7v10.7c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7V56.9   c0-0.4,0.3-0.7,0.7-0.7h9.1c0.4,0,0.7,0.3,0.7,0.7v11.4C48.4,68.7,48.1,69,47.7,69z"></path></g><g><path d="M50,50.7c-0.2,0-0.4-0.1-0.5-0.2l-6.3-6.3l-6.3,6.3c-0.3,0.3-0.7,0.3-1,0s-0.3-0.7,0-1l6.9-6.9c0.3-0.3,0.7-0.3,1,0   l6.9,6.9c0.3,0.3,0.3,0.7,0,1C50.4,50.6,50.2,50.7,50,50.7z"></path></g><g><path d="M31.7,50.7H18c-0.2,0-0.5-0.1-0.6-0.3c-0.1-0.2-0.2-0.5-0.1-0.7l6.9-16c0.1-0.3,0.4-0.4,0.7-0.4h4.6   c0.4,0,0.7,0.3,0.7,0.7s-0.3,0.7-0.7,0.7h-4.1l-6.2,14.6h12.6c0.4,0,0.7,0.3,0.7,0.7S32.1,50.7,31.7,50.7z"></path></g><g><path d="M64.4,41.6c-0.3,0-0.5-0.2-0.7-0.4l-2.8-6.4H34c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7h27.4c0.3,0,0.5,0.2,0.7,0.4   l2.9,6.9c0.2,0.4,0,0.8-0.4,0.9C64.5,41.6,64.4,41.6,64.4,41.6z"></path></g><g><path d="M59.1,50.7H50c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7h9.1c0.4,0,0.7,0.3,0.7,0.7S59.5,50.7,59.1,50.7z"></path></g><g><path d="M34,62.1h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-6.9c0-0.4,0.3-0.7,0.7-0.7H34c0.4,0,0.7,0.3,0.7,0.7v6.9   C34.7,61.8,34.4,62.1,34,62.1z M27.9,60.7h5.4v-5.4h-5.4V60.7z"></path></g><g><path d="M59.1,62.1h-6.9c-0.4,0-0.7-0.3-0.7-0.7v-6.9c0-0.4,0.3-0.7,0.7-0.7h6.9c0.4,0,0.7,0.3,0.7,0.7v6.9   C59.8,61.8,59.5,62.1,59.1,62.1z M53,60.7h5.4v-5.4H53V60.7z"></path></g><g><path d="M36.3,34.7c-0.4,0-0.7-0.3-0.7-0.7v-6.1h-5.4V34c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7v-6.9   c0-0.4,0.3-0.7,0.7-0.7h6.9c0.4,0,0.7,0.3,0.7,0.7V34C37,34.4,36.7,34.7,36.3,34.7z"></path></g><g><path d="M43.1,69H22.6c-0.4,0-0.7-0.3-0.7-0.7V50c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v17.6h19.8c0.4,0,0.7,0.3,0.7,0.7   S43.5,69,43.1,69z"></path></g><g><path d="M63.7,69H52.3c-0.4,0-0.7-0.3-0.7-0.7s0.3-0.7,0.7-0.7H63v-3.9c0-0.4,0.3-0.7,0.7-0.7s0.7,0.3,0.7,0.7v4.6   C64.4,68.7,64.1,69,63.7,69z"></path></g><g><path d="M72.8,64.4c-5.4,0-9.8-4.4-9.8-9.8c0-5.2,8.9-18.1,9.3-18.7c0.3-0.4,0.9-0.4,1.2,0c0.4,0.5,9.3,13.5,9.3,18.7   C82.7,60,78.3,64.4,72.8,64.4z M72.8,37.6c-2,3-8.4,13-8.4,17c0,4.6,3.8,8.4,8.4,8.4s8.4-3.8,8.4-8.4   C81.3,50.5,74.8,40.6,72.8,37.6z"></path></g><g><path d="M72.8,69c-0.4,0-0.7-0.3-0.7-0.7V47.7c0-0.4,0.3-0.7,0.7-0.7c0.4,0,0.7,0.3,0.7,0.7v20.6C73.5,68.7,73.2,69,72.8,69z"></path></g><g><path d="M72.8,55.3c-0.2,0-0.4-0.1-0.5-0.2c-0.3-0.3-0.3-0.7,0-1l2.3-2.3c0.3-0.3,0.7-0.3,1,0s0.3,0.7,0,1l-2.3,2.3   C73.2,55.2,73,55.3,72.8,55.3z"></path></g><g><path d="M72.8,59.8c-0.2,0-0.4-0.1-0.5-0.2l-4.6-4.6c-0.3-0.3-0.3-0.7,0-1s0.7-0.3,1,0l4.6,4.6c0.3,0.3,0.3,0.7,0,1   C73.2,59.8,73,59.8,72.8,59.8z"></path></g><g><path d="M75.1,30.2c-0.4,0-0.7-0.3-0.7-0.7c0-1.9-1.4-2.7-2.7-2.7S69,27.6,69,29.4c0,0.4-0.3,0.7-0.7,0.7c-0.4,0-0.7-0.3-0.7-0.7   c-2.7,2.1-4.1,4.1-4.1,4.1C75.8,29.8,75.5,30.2,75.1,30.2z"></path></g><g><path d="M68.3,30.2c-0.4,0-0.7-0.3-0.7-0.7c0-3.4-2.8-6.1-6.1-6.1c-3.4,0-6.1,2.8-6.1,6.1c0,0.4-0.3,0.7-0.7,0.7s-0.7-0.3-0.7-0.7   c-4.2,3.4-7.6,7.6c4.2,0,7.6,3.4,7.6,7.6C69,29.8,68.7,30.2,68.3,30.2z"></path></g><g><path d="M54.6,30.2c-0.4,0-0.7-0.3-0.7-0.7c0-0.9-0.7-1.6-1.6-1.6c-0.9,0-1.6,0.7-1.6,1.6c0,0.4-0.3,0.7-0.7,0.7   c-0.4,0-0.7-0.3-0.7-0.7c0-1.7,1.3-3,3-3c1.7,0,3,1.3,3,3C55.3,29.8,55,30.2,54.6,30.2z"></path></g><g><path d="M8.9,50.7c-0.4,0-0.7-0.3-0.7-0.7C8.2,26.6,26.6,8.2,50,8.2c14.1,0,27.2,6.1,34.8,16.3c0.2,0.3,0.2,0.8-0.1,1   c-0.3,0.2-0.8,0.2-1,0.1C76.3,15.5,63.7,9.6,50,9.6C27.3,9.6,9.6,27.4,9.6,50C9.6,50.4,9.3,50.7,8.9,50.7z"></path></g><g><path d="M50,91.8c-13.3,0-24.5-5.6-32.5-16.3c-0.2-0.3-0.2-0.8,0.1-1c0.3-0.2,0.8-0.2,1,0.1C26.4,85.1,37,90.4,50,90.4   c22.7,0,40.4-17.7,40.4-40.4c0-0.4,0.3-0.7,0.7-0.7s0.7,0.3,0.7,0.7C91.8,73.4,73.4,91.8,50,91.8z"></path></g><g><path d="M8.9,53c-0.2,0-0.4-0.1-0.5-0.2l-4.6-4.6c-0.3-0.3-0.3-0.7,0-1s0.7-0.3,1,0l4.1,4.1l4.1-4.1c0.3-0.3,0.7-0.3,1,0   s0.3,0.7,0,1l-4.6,4.6C9.3,52.9,9.1,53,8.9,53z"></path></g><g><path d="M95.7,53c-0.2,0-0.4-0.1-0.5-0.2l-4.1-4.1L87,52.8c-0.3,0.3-0.7,0.3-1,0s-0.3-0.7,0-1l4.6-4.6c0.3-0.3,0.7-0.3,1,0   l4.6,4.6c0.3,0.3,0.3,0.7,0,1C96,52.9,95.9,53,95.7,53z"></path></g></g></svg>
    ),
  },
  {
    key: 'advanced',
    num: '02',
    railTitle: 'Projects\nOverviews',
    subtitle: 'Intelligent Solution',
    title: ['Next-Gen Solar', 'For Your Home!'],
    body: 'Ante orci diam semper cursus magna sem scelerisque. Amet ligula maximus nam ad class vulputate felis enim.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/home1-1-01.jpg',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M73.2,96c-0.7,0-1.3-0.6-1.3-1.3V83.8c0-0.4,0.1-0.7,0.4-0.9l16.4-16.4c0.1-0.1,2.3-2.5,2.3-7.3V31.9   c0-0.7-0.2-4.1-4.1-4.1c-3.9,0-4.1,3.5-4.1,4.1v19.8c0,0.7-0.6,1.3-1.3,1.3c-0.7,0-1.3-0.6-1.3-1.3V31.9c0-2.3,1.4-6.8,6.8-6.8   c5.4,0,6.8,4.4,6.8,6.8v27.3c0,5.9-3,9-3.1,9.1l-16,16v10.4C74.5,95.4,73.9,96,73.2,96z"></path></g><g><path d="M54.1,96.7c-0.7,0-1.3-0.6-1.3-1.3V70.1c0-0.3,0.1-0.6,0.3-0.8l13.7-16.4c0,0,2.3-3.6,5.6-4.1c1.5-0.3,3.1,0.2,4.4,1.2   c1.8,1.4,2.6,3.1,2.5,5c-0.1,1.6-0.8,3.2-2.3,5.1l-8.2,10.9c-0.4,0.6-1.3,0.7-1.9,0.3c-0.6-0.4-0.7-1.3-0.3-1.9l8.2-10.9   c1.1-1.4,1.7-2.6,1.7-3.6c0-0.6-0.1-1.6-1.5-2.7c-0.8-0.6-1.5-0.8-2.3-0.7c-2.1,0.4-3.9,3.1-3.9,3.1L55.4,70.6v24.8   C55.4,96.1,54.8,96.7,54.1,96.7z"></path></g><g><path d="M26.8,96c-0.7,0-1.3-0.6-1.3-1.3V84.3l-16-16c-0.1-0.1-3.1-3.2-3.1-9.1V31.9c0-2.3,1.4-6.8,6.8-6.8s6.8,4.4,6.8,6.8v19.8   c0,0.7-0.6,1.3-1.3,1.3s-1.3-0.6-1.3-1.3V31.9c0-0.7-0.2-4.1-4.1-4.1S9,31.2,9,31.9v27.3c0,4.8,2.3,7.2,2.3,7.3l16.4,16.4   c0.2,0.2,0.4,0.6,0.4,0.9v10.9C28.1,95.4,27.5,96,26.8,96z"></path></g><g><path d="M45.9,96.7c-0.7,0-1.3-0.6-1.3-1.3V70.6l-13.3-16c-0.6-0.9-2.2-2.9-4-3.2c-0.8-0.1-1.6,0.1-2.3,0.7   c-1.5,1.2-2.5,2.8,0.2,6.3l8.2,10.9c0.4,0.6,0.3,1.4-0.3,1.9c-0.6,0.4-1.4,0.3-1.9-0.3L23,60c-3.9-5.1-2-8.2,0.2-10   c1.4-1.1,2.9-1.5,4.4-1.2c3.3,0.6,5.6,4.1,5.7,4.3l13.6,16.2c0.2,0.2,0.3,0.5,0.3,0.8v25.3C47.2,96.1,46.6,96.7,45.9,96.7z"></path></g><g><path d="M45.9,60.5c-0.2,0-0.3,0-0.5-0.1c-0.6-0.2-0.9-0.8-0.8-1.4l2.5-25.3l-14.4,4.8c-0.5,0.2-1,0-1.4-0.4   c-0.4-0.4-0.5-0.9-0.3-1.4L44.7,4.1c0.3-0.7,1.1-1,1.7-0.7c0.7,0.3,1,1.1,0.7,1.7L34.6,35.2l13.6-4.5c0.4-0.1,0.9-0.1,1.2,0.2   c0.4,0.3,0.5,0.7,0.5,1.2l-2.3,22.6l13.5-18.1c0.4-0.6,1.3-0.7,1.9-0.3c0.6,0.4,0.7,1.3,0.3,1.9L47,60   C46.7,60.3,46.3,60.5,45.9,60.5z"></path></g><g><path d="M65,33.2c-0.3,0-0.6-0.1-0.8-0.3c-0.6-0.4-0.7-1.3-0.3-1.9l6.3-8.4l-16,2.3c-0.5,0.1-0.9-0.1-1.2-0.5   c-0.3-0.4-0.4-0.9-0.2-1.3l7.4-17.3h-8.9c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3h10.9c0.4,0,0.9,0.2,1.1,0.6   c0.2,0.4,0.3,0.8,0.1,1.2l-7.3,17L73,19.7c0.5-0.1,1.1,0.2,1.3,0.6c0.3,0.5,0.2,1-0.1,1.5l-8.2,10.9C65.8,33,65.4,33.2,65,33.2z"></path></g></g></svg>
    ),
  },
  {
    key: 'unlimited',
    num: '03',
    railTitle: 'Customise\nSolutions',
    subtitle: 'Cleaner Future',
    title: ['Powering A Greener', 'Future With Solar'],
    body: 'Hendrerit volutpat sectetur metus volutpat memmasse.',
    img: 'https://zolar.wpengine.com/wp-content/uploads/2024/08/home1-1-02.jpg',
    icon: (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g><g><path d="M81.4,62.3c-0.3,0-0.6-0.1-0.9-0.4c-0.5-0.5-0.5-1.3,0-1.8l6.6-6.6L76,55c-0.5,0.1-1-0.2-1.2-0.6c-0.3-0.4-0.2-1,0.1-1.4   L82.6,42h-4.9c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3h7.4c0.5,0,0.9,0.3,1.1,0.7c0.2,0.4,0.2,0.9-0.1,1.3l-7.5,10.6l11.9-1.5   c0.6-0.1,1.1,0.2,1.3,0.7c0.2,0.5,0.1,1.1-0.2,1.5L82.3,62C82,62.2,81.7,62.3,81.4,62.3z"></path></g><g><path d="M62.9,80.8c-0.3,0-0.5-0.1-0.7-0.2c-0.5-0.3-0.7-1-0.4-1.6L70,60.9l-8.7,1.5c-0.5,0.1-1-0.1-1.3-0.5   c-0.3-0.4-0.3-0.9,0-1.4L71.1,42c0.4-0.6,1.1-0.8,1.7-0.4c0.6,0.4,0.8,1.1,0.4,1.7l-9.7,16.1l8.4-1.4c0.5-0.1,0.9,0.1,1.2,0.5   s0.3,0.9,0.1,1.3L67,73.7l9.8-9.8c0.5-0.5,1.3-0.5,1.8,0c0.5,0.5,0.5,1.3,0,1.8L63.8,80.4C63.6,80.7,63.2,80.8,62.9,80.8z"></path></g><g><path d="M53.5,73.3c-12.9,0-23.3-10.5-23.3-23.3s10.5-23.3,23.3-23.3c8.7,0,15.7,3.5,19.7,9.7c0.4,0.6,0.2,1.4-0.4,1.8   c-0.6,0.4-1.4,0.2-1.8-0.4c-3.5-5.5-9.8-8.6-17.5-8.6c-11.5,0-20.8,9.3-20.8,20.8s9.3,20.8,20.8,20.8c2.9,0,6.5-0.7,8.9-1.7   c0.6-0.3,1.4,0,1.7,0.7c0.3,0.6,0,1.4-0.7,1.7C60.7,72.6,56.8,73.3,53.5,73.3z"></path></g><g><circle cx="51.8" cy="42.6" r="0.9"></circle></g><g><circle cx="46.3" cy="48.2" r="0.9"></circle></g><g><circle cx="42.6" cy="55.5" r="0.9"></circle></g><g><circle cx="48.2" cy="61.1" r="0.9"></circle></g><g><path d="M53.7,95.6c-0.7,0-1.3-0.6-1.3-1.3V81.4c0-0.7,0.6-1.3,1.3-1.3s1.3,0.6,1.3,1.3v12.9C55,95,54.4,95.6,53.7,95.6z"></path></g><g><path d="M53.7,19.9c-0.7,0-1.3-0.6-1.3-1.3V5.7c0-0.7,0.6-1.3,1.3-1.3S55,5,55,5.7v12.9C55,19.3,54.4,19.9,53.7,19.9z"></path></g><g><path d="M85,82.6c-0.3,0-0.6-0.1-0.9-0.4l-7.3-7.3c-0.5-0.5-0.5-1.3,0-1.8c0.5-0.5,1.3-0.5,1.8,0l7.3,7.3c0.5,0.5,0.5,1.3,0,1.8   C85.7,82.5,85.3,82.6,85,82.6z"></path></g><g><path d="M31.5,29.1c-0.3,0-0.6-0.1-0.9-0.4l-9.1-9.1c-0.5-0.5-0.5-1.3,0-1.8c0.5-0.5,1.3-0.5,1.8,0l9.1,9.1c0.5,0.5,0.5,1.3,0,1.8   C32.2,29,31.8,29.1,31.5,29.1z"></path></g><g><path d="M75.9,29.1c-0.3,0-0.6-0.1-0.9-0.4c-0.5-0.5-0.5-1.3,0-1.8l9.1-9.1c0.5-0.5,1.3-0.5,1.8,0c0.5,0.5,0.5,1.3,0,1.8l-9.1,9.1   C76.5,29,76.2,29.1,75.9,29.1z"></path></g><g><path d="M22.4,82.6c-0.3,0-0.6-0.1-0.9-0.4c-0.5-0.5-0.5-1.3,0-1.8l9.1-9.1c0.5-0.5,1.3-0.5,1.8,0c0.5,0.5,0.5,1.3,0,1.8l-9.1,9.1   C23,82.5,22.7,82.6,22.4,82.6z"></path></g><g><path d="M22.3,51.3H9.4c-0.7,0-1.3-0.6-1.3-1.3s0.6-1.3,1.3-1.3h12.9c0.7,0,1.3,0.6,1.3,1.3S23,51.3,22.3,51.3z"></path></g></g></svg>
    ),
  },
];

// —— Animation variants ——
const bgVariant = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.8 } },
  exit: { opacity: 0, transition: { duration: 0.8 } },
}

const textVariant = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.6, ease: 'easeIn' } },
}

export default function Hero() {
  const { heroSlides, loading } = useAppContext();
  const [active, setActive] = useState(0);
  
  // Process slides to construct image URLs
  const slides = useMemo(() => {
    // Debug log for hero slides
    console.log('Hero slides from context:', heroSlides);
    
    if (!heroSlides || heroSlides.length === 0) {
      console.log('Using fallback slides');
      return FALLBACK_SLIDES;
    }
    
    const processedSlides = heroSlides.map((slide, index) => {
      // Check if img is a relative path and needs to be fixed
      let imgUrl = slide.img;
      if (imgUrl && imgUrl.startsWith('/uploads/')) {
        // If it's a relative path from backend, ensure it's properly handled
        // The backend now provides fullUrl for media, but we handle both cases
        imgUrl = slide.fullUrl || `${window.location.origin}${imgUrl}`;
      }
      
      return {
        key: slide.key || `slide-${index}`,
        num: slide.num || `0${index + 1}`,
        railTitle: slide.railTitle || 'Solar Energy',
        subtitle: slide.subtitle || 'Eco-Friendly Energy',
        title: Array.isArray(slide.title) ? slide.title : ['Powering A Greener', 'Future With Solar'],
        body: slide.body || 'Clean energy solutions for a sustainable future.',
        img: imgUrl || 'https://zolar.wpengine.com/wp-content/uploads/2024/08/zolar-h1-slider-img-alt.jpg',
        icon: typeof slide.icon === 'string' ? slide.icon : FALLBACK_SLIDES[index % FALLBACK_SLIDES.length].icon
      };
    });
    
    console.log('Processed slides:', processedSlides);
    console.log('Slides count:', processedSlides.length);
    console.log('Using fallback?', false);
    
    return processedSlides;
  }, [heroSlides]);
    
  // Debug log to check slides data
  console.log('Hero component - slides data:', {
    heroSlidesFromContext: heroSlides,
    processedSlides: slides,
    slidesCount: slides.length,
    usingFallback: !heroSlides || heroSlides.length === 0
  });
  
  // Set active slide to first one when slides change
  useEffect(() => {
    if (slides && slides.length > 0) {
      console.log('Slides changed, setting active to first slide');
      setActive(0);
    }
  }, [slides]);
  
  // Auto slide functionality
  useEffect(() => {
    console.log('Setting up auto slide interval with slides:', slides.length);
    console.log('Current slides data:', slides);
    
    // Only set up interval if we have more than one slide
    if (slides && slides.length > 1) {
      console.log('Starting auto-slide interval');
      const interval = setInterval(() => {
        console.log('Auto slide triggered, current active:', active);
        setActive((current) => {
          // Simplified calculation for next slide index
          const nextIndex = (typeof current === 'number' ? current : slides.findIndex(s => s.key === current)) + 1;
          const nextActive = nextIndex % slides.length;
          console.log('Setting next active slide to:', nextActive);
          return nextActive;
        });
      }, 5000); // Change slide every 5 seconds
      
      return () => {
        console.log('Clearing auto slide interval');
        clearInterval(interval);
      };
    } else {
      console.log('Not setting up auto-slide interval - fewer than 2 slides');
      console.log('IMPORTANT: Check if you have at least 2 active hero slides in the database');
      console.log('If using fallback slides, check FALLBACK_SLIDES array:', FALLBACK_SLIDES.length);
    }
  }, [slides]); // Removed active as dependency to prevent interval recreation on every slide change
  
  // Get current slide
  const slide = typeof active === 'number' 
    ? slides[active] 
    : slides.find((s) => s.key === active) ?? slides[0]

  // Log current slide for debugging
  useEffect(() => {
    console.log('Current active slide:', slide);
  }, [slide]);

  return (
    <section className="relative bg-black h-[650px] sm:h-[750px] lg:h-screen overflow-hidden">
      {/* BACKGROUND CROSS-FADE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.key}
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${slide.img})` }}
          variants={bgVariant}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-[#142334]/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center pb-16 md:pb-24">
              {/* left rail ****************************************************** */}
        <aside className="hidden md:flex flex-col w-72">
          {slides.map((s, index) => {
            const activeItem = typeof active === 'number' ? index === active : s.key === active;
            return (
              <button
                key={s.key}
                onClick={() => setActive(index)}
                className="group relative flex items-start py-8 focus:outline-none"
              >
                {/* icon circle */}
                <span
                  className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition ms-5 ${activeItem ? 'bg-transparent' : 'bg-transparent'}`}
                >
                  {typeof s.icon === 'string' ? (
                    <span 
                      className={`h-12 w-12 ${
                        activeItem ? 'text-accent-500' : 'text-white'
                      }`}
                      dangerouslySetInnerHTML={{ __html: s.icon }}
                    />
                  ) : (
                    <svg
                      className={`h-12 w-12 stroke-current ${
                        activeItem ? 'text-accent-500' : 'text-white'
                      }`}
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      {s.icon}
                    </svg>
                  )}
                </span>


                {/* text */}
                <span className="ml-6">
                  {s.railTitle.split('\n').map(line => (
                    <span
                      key={line}
                      className={`block font-medium leading-snug font-space-grotesk ${
                        activeItem ? 'text-accent-500' : 'text-white'
                      }`}
                    >
                      {line}
                    </span>
                  ))}
                </span>


                {/* divider + number */}
                <span
                  className={`absolute left-0 -bottom-2 w-full h-px ${
                    activeItem ? 'bg-accent-500' : 'bg-white/40'
                  }`}
                />
                <span
                  className={`absolute -right-6 top-1/2 -translate-y-1/2 text-xl font-bold ${
                    activeItem ? 'text-accent-500 scale-125 transition-transform duration-300' : 'text-white/70'
                  }`}
                >
                  {s.num}
                </span>
              </button>
            );
          })}
        </aside>
        {/* MOBILE CONTROLS */}
        <div className="flex md:hidden justify-center w-full absolute bottom-4 z-30 px-4">
          <div className="flex space-x-4 bg-black/30 rounded-full p-2">
            {slides.map((s, index) => {
              const isActive = typeof active === 'number' 
                ? active === index 
                : s.key === active;
              return (
                <motion.button
                  key={s.key}
                  onClick={() => setActive(index)}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`p-2 rounded-full ${
                    isActive
                      ? 'bg-accent-500 text-black'
                      : 'bg-primary-600/50 text-white'
                  }`}
                >
                  <span className="text-xs font-bold">{s.num}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* CENTER TEXT & CTA */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4 max-w-3xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.key}
              variants={textVariant}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <p className="text-accent-500 tracking-wider text-sm md:text-lg mb-4 font-space-grotesk">
                — ✷ {slide.subtitle} ✷ —
              </p>
              <h1 className="font-bold text-white text-4xl md:text-6xl lg:text-[80px] leading-tight mb-6 font-space-grotesk">
                {slide.title[0]}<br />
                {slide.title[1]}
              </h1>
              <p className="text-white/80 text-base md:text-xl mb-8 px-2">
                {slide.body}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">  
                <Link
                  to="/advanced-calculator"
                  className="group relative overflow-hidden inline-flex items-center pl-5 sm:pl-8 md:pl-10 pr-4 sm:pr-5 md:pr-6 py-2 sm:py-3 md:py-3 bg-accent-500 text-gray-900 rounded-full font-semibold shadow-lg text-sm sm:text-base md:text-lg border-2 border-transparent hover:border-accent-500 transition-all duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Try Advanced Calculator</span>
                  <span className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                  <span className="ml-3 sm:ml-4 md:ml-5 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-primary-600 group-hover:bg-accent-500 transition-all duration-300 relative z-10">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 stroke-white group-hover:stroke-black transition-all duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  to="/contact"
                  className="group relative overflow-hidden inline-flex items-center pl-5 sm:pl-8 md:pl-10 pr-4 sm:pr-5 md:pr-6 py-2 sm:py-3 md:py-3 bg-transparent text-white rounded-full font-semibold shadow-lg text-sm sm:text-base md:text-lg border-2 border-white hover:border-accent-500 transition-all duration-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Discover More</span>
                  <span className="absolute inset-0 bg-accent-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></span>
                  <span className="ml-3 sm:ml-4 md:ml-5 flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-white group-hover:bg-accent-500 transition-all duration-300 relative z-10">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 stroke-primary-600 group-hover:stroke-white transition-all duration-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </span>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
