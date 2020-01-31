import React from 'react';
import { HomeSpotlightSection } from 'app/components/Home/HomeSpotlightSection';
import { render, cleanup } from '@testing-library/react';

jest.mock('vex-js', () => ({ registerPlugin: () => null }));

beforeEach(() => {
  cleanup();
});

describe('HomeSpotlightSection test', () => {
  it('should be render HomeSpotlightSection', () => {
    render(
      <HomeSpotlightSection
        books={[]}
        collectionId={1}
        title={'hot spot'}
        trackClick={() => null}
        trackImpression={() => null}
      />
    );
  });
});
