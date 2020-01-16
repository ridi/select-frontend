import { stateHydrator } from 'app/utils/stateHydrator';
import { RidiSelectState } from 'app/store';

beforeEach(() => {
  localStorage.clear();
});

describe('stateHydrator', () => {
  it('should save state correctly', () => {
    const mockState = {} as RidiSelectState;
    stateHydrator.save(mockState);
    expect(stateHydrator.load()).toEqual(mockState);
  });
  it('should delete the state after calling load', () => {
    const mockState = {} as RidiSelectState;
    stateHydrator.save(mockState);
    stateHydrator.load(); // load once
    expect(stateHydrator.load()).toEqual(mockState);
  });
});
