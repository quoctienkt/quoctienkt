'use client';

import { useEffect, useState } from 'react';
import { classes, toggle } from '@/utils/toggle';
import pageData from './data.json';
import Image from 'next/image';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const moonPng =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/image-moon.png';
const marsPng =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/image-mars.png';
const europaPng =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/image-europa.png';
const titanPng =
  '/quoctienkt/previews/space-tourism-layout/assets/destination/image-titan.png';

const destinationsData = pageData.destinations;

const destinationImages = {
  Moon: moonPng,
  Mars: marsPng,
  Europa: europaPng,
  Titan: titanPng,
};

type TabTypes = 'Moon' | 'Mars' | 'Europa' | 'Titan';
type TabStatus =
  | 'hidden'
  | 'transitioning-in-start'
  | 'active'
  | 'transitioning-out';

type DestinationStates = {
  tabActive: TabTypes;
  tabTransitioningInStart: TabTypes | null;
  tabTransitioningOut: TabTypes | null;
};

const defaultState: DestinationStates = {
  tabActive: 'Moon',
  tabTransitioningInStart: null,
  tabTransitioningOut: null,
};

export function Destination() {
  const [state, setState] = useState<DestinationStates>(defaultState);

  const getTabStatus = (tab: TabTypes): TabStatus => {
    if (tab === state.tabTransitioningInStart) return 'transitioning-in-start';
    if (tab === state.tabActive) return 'active';
    if (tab === state.tabTransitioningOut) return 'transitioning-out';
    return 'hidden';
  };

  const getTabCss = (tab: string): string => {
    const status = getTabStatus(tab as TabTypes);
    if (status === 'transitioning-in-start')
      return '!block translate-x-[100%] transition-none';
    if (status === 'active')
      return '!block translate-x-0 [transition:transform_0.6s_ease] [transition-delay:350ms]';
    if (status === 'transitioning-out')
      return '!block -translate-x-[100%] [transition:transform_0.6s_ease-in-out]';
    return 'hidden';
  };

  const handleTabClicked = (tab: TabTypes) => {
    if (tab !== state.tabActive) {
      setState((prev) => ({ ...prev, tabTransitioningInStart: tab }));
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          tabTransitioningOut: prev.tabActive,
          tabActive: tab,
          tabTransitioningInStart: null,
        }));
      }, 1);
    }
  };

  return (
    <>
      <main className="flex-1 z-10 flex flex-col w-full relative max-lg:gap-10">
        {/* Header */}
        <header
          className="flex-none pt-[7%] pb-[5%] flex flex-row items-center justify-center uppercase text-center text-white w-[55%] max-lg:basis-0 max-sm:text-center max-sm:w-full max-sm:text-base"
          style={{
            fontFamily: 'Barlow Condensed',
            fontSize: 28,
            letterSpacing: '4.725px',
          }}
        >
          Pick your destination
        </header>

        {/* Content */}
        <section className="flex-auto basis-3/4 flex flex-row w-full relative justify-evenly max-lg:flex-col max-lg:gap-4 max-lg:items-center">
          {/* Planet image */}
          <div className="flex-none max-lg:flex max-lg:justify-center">
            <Image
              className="w-[430px] h-[430px] max-lg:w-[300px] max-lg:h-[300px] max-sm:w-[230px] max-sm:h-[230px]"
              src={destinationImages[state.tabActive]}
              alt={`${state.tabActive} image`}
              width={430}
              height={430}
            />
          </div>

          {/* Info panel */}
          <div className="h-full w-[448px] relative max-lg:w-8/12 max-lg:flex max-lg:flex-col max-lg:items-center">
            {/* Tabs */}
            <div className="flex flex-row gap-8 max-sm:gap-4">
              {(['Moon', 'Mars', 'Europa', 'Titan'] as TabTypes[]).map(
                (tab) => (
                  <div
                    key={tab}
                    className={classes(
                      'relative py-2 cursor-pointer select-none uppercase',
                      toggle(
                        state.tabActive === tab,
                        "after:content-[''] after:block after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0.5 after:bg-white",
                      ),
                    )}
                    onClick={() => handleTabClicked(tab)}
                  >
                    {tab}
                  </div>
                ),
              )}
            </div>

            {/* Tab contents */}
            <div className="h-full w-full relative overflow-hidden max-lg:w-full max-lg:text-center max-sm:w-full">
              {destinationsData.map((destination) => (
                <div
                  key={destination.name}
                  onTransitionEnd={() => {
                    if (state.tabTransitioningInStart !== destination.name) {
                      setState((prev) => ({
                        ...prev,
                        tabTransitioningInStart: null,
                      }));
                    }
                    if (state.tabTransitioningOut !== destination.name) {
                      setState((prev) => ({
                        ...prev,
                        tabTransitioningOut: null,
                      }));
                    }
                  }}
                  className={classes(
                    'w-full float-left mr-[-100%]',
                    getTabCss(destination.name),
                  )}
                >
                  {/* Name */}
                  <div className="text-[100px] uppercase font-['Bellefair'] max-lg:text-7xl max-lg:mt-8 max-lg:mb-5 max-sm:text-6xl max-sm:mt-6 max-sm:mb-3">
                    {destination.name}
                  </div>

                  {/* Description */}
                  <div
                    className="text-justify font-['Barlow'] text-[#D0D6F9] max-lg:text-center"
                    style={{ lineHeight: '32px' }}
                  >
                    {destination.description}
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-[#383B4B] mt-9 mb-6" />

                  {/* Stats */}
                  <div className="flex flex-row gap-20 pb-8 max-lg:justify-evenly max-sm:flex-col max-sm:gap-0">
                    <div className="max-sm:mb-8">
                      <div
                        className="uppercase font-['Barlow_Condensed'] text-[#D0D6F9]"
                        style={{ letterSpacing: '2.362px' }}
                      >
                        AVG. DISTANCE
                      </div>
                      <div className="uppercase text-3xl font-['Bellefair']">
                        {destination.distance}
                      </div>
                    </div>
                    <div className="max-sm:mb-8">
                      <div
                        className="uppercase font-['Barlow_Condensed'] text-[#D0D6F9]"
                        style={{ letterSpacing: '2.362px' }}
                      >
                        Est. travel time
                      </div>
                      <div className="uppercase text-3xl font-['Bellefair']">
                        {destination.travel}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
