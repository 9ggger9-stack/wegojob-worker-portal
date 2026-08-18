import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import PersonalQuestionnaire from './pages/PersonalQuestionnaire';
import BankAccount from './pages/BankAccount';
import Confidentiality from './pages/Confidentiality';
import Zus from './pages/Zus';
import PpkResignation from './pages/PpkResignation';
import DocumentChecklist from './pages/DocumentChecklist';
import DocumentPhotos from './pages/DocumentPhotos';
import Clothing from './pages/Clothing';
import ClothingReturn from './pages/ClothingReturn';
import Vacation from './pages/Vacation';
import Contact from './pages/Contact';
import CoordinatorPanel from './pages/CoordinatorPanel';

const TITLES = {
  home: 'Portal pracownika',
  onboarding: 'Dokumenty zatrudnienia',
  personal: 'Kwestionariusz osobowy',
  bank: 'Konto bankowe',
  zus: 'Oświadczenie ZUS',
  confidentiality: 'Poufność',
  ppk: 'Rezygnacja z PPK',
  photos: 'Zdjęcia dokumentów',
  checklist: 'Checklista',
  clothing: 'Otrzymanie odzieży i wyposażenia',
  clothing_return: 'Zwrot odzieży i wyposażenia',
  vacation: 'Wniosek o urlop',
  contact: 'Kontakt z koordynatorem',
  coordinator: 'Panel koordynatora'
};

export default function App() {
  const [page, setPage] = useState('home');
  const [worker, setWorker] = useState({ name: '' });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash) {
        setPage(hash);
      } else {
        setPage('home');
      }
    };

    window.addEventListener('popstate', handler);
    window.addEventListener('hashchange', handler);

    return () => {
      window.removeEventListener('popstate', handler);
      window.removeEventListener('hashchange', handler);
    };
  }, []);

  function openPage(id) {
    history.pushState(
      { page: id },
      '',
      `#${id}`
    );

    setPage(id);
  }

  function goBack() {
    if (page === 'home') return;

    if (
      [
        'personal',
        'bank',
        'zus',
        'confidentiality',
        'ppk',
        'photos',
        'checklist',
        'clothing',
        'clothing_return'
      ].includes(page)
    ) {
      setPage('onboarding');
    } else {
      setPage('home');
    }
  }

  const content = {
    home: (
      <Home
        worker={worker}
        openPage={openPage}
      />
    ),

    onboarding: (
      <Onboarding
        openPage={openPage}
      />
    ),

    personal: <PersonalQuestionnaire />,

    bank: <BankAccount />,

    zus: <Zus />,

    confidentiality: <Confidentiality />,

    ppk: <PpkResignation />,

    photos: <DocumentPhotos />,

    checklist: <DocumentChecklist />,

    clothing: (
      <Clothing
        worker={worker}
      />
    ),

    clothing_return: (
      <ClothingReturn
        worker={worker}
      />
    ),

    vacation: (
      <Vacation
        worker={worker}
      />
    ),

    contact: (
      <Contact
        worker={worker}
      />
    ),

    coordinator: (
      <CoordinatorPanel />
    )
  }[page];

  return (
    <Layout
      title={
        TITLES[page] ||
        'Portal pracownika'
      }
      onHome={() => setPage('home')}
      onBack={
        page !== 'home'
          ? goBack
          : null
      }
    >
      {content}
    </Layout>
  );
}