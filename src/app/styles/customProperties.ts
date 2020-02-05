import { css } from '@emotion/core';

export const graySpinner =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWU0ODQ4My1hNmFhLTQxMjctOGQ5NC0yN2JiODQyZDRmNzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjUxQjQ1M0YzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjUxQjQ1M0UzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDE1YjljYzgtNzdhYy00N2JiLWJlNTEtNzRjNjA1MzE4NDFhIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWZlMTFkZmItYjlmNi01YjQ5LWIyNTctMDc2NDM4ZmJiOTRiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fCp2XAAAAYBQTFRF0tXYrrK54+TmjZOc0NPWpaqx9PX26uvt8PHyqa60oaatjpWesra8sLW7mJ6m3uDjztDU7O3u1dfb19nc6+ztwsbKm6CouLzCvsLHhYyWnaKqwMTJkpihvcDGgomTx8rOrLC3n6SsipCaiI+YoqeuhIuVj5aezM/Ttbm/5ufpv8PI8vP02dveq7C3l52lgIeR/v7+/f39/Pz89/f4+Pj59PT19vf37u/wxcjN3N7h8/P05ebo5+jq+vr6+vr7+/v78/T13d/i+/v8t7vB4OLko6iw2tzfp6yz9vb36Onr9fb21NbZ+fn5+fn67+/x7e7v8fLzys3R4eLl6ersur7D293gzdDUtrrAxMfM3d/h2Nrd5Obo8vLzu7/Ey87S7/Dx4+Xn4OHktLi+yMvP0dPXz9LW3N7g4ePl5efp3t/ilpykzc/TyczQuLzBt7vAkZegvL/FyMvQwcXKxsnOg4qUwMPI4uPmwsXKxsnNo6ivoaeuvMDFvsHGlZukk5mi////Oag5iQAAAIB0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA4BUtnAAAGZklEQVR42uza/VPaSBgH8IAKSKkCvo7Uq3fXChiCmxBEaXmptRSQF634VtuxKvTtrr22M3fXuWsv//qp5OVJdknIUnIzN/3+yBA+brL77EtkJNqw5yOrPy95aS9naC+M/7R6lbtPHYYLy6vd3D11Fg6uKplzFnap8ISz8GMVXv5/wVuur7+NdXjH4aOR63A5h+GnI3JaDsN+BR6JOwoj1R0ZcxTmNXgk7OitXtbgiZyT8Dlo8oyTcPOGBi/7nBzH86DJASdh8S2Q3U6WzDaA/chBGPmBPOrk7OQG8FvRyWkxAOR5J2EfqCI3mk4uBI5Ak11OwrkJIL9xcukTBvACPxSY54nfGQNy9NvD4sxsMvlXUCBsGgD8T7X72bgK/zMgXB1LXufRBv6l90B+3v2opcJj/UF8KsuyngIOv08quRkyXpS+BYZUvnsXVLjdD4tEthvRCNeSWiYia4brPoImN7ofxWRXV8F7jowiq0QwwI0kzEJb382EWQ2eltvQ+uHKXapbs4KH1VI2wJmkPmOvdNeWNHhH+ex098P6Xh93eY2FKRrgctKYc93+c1xxvyJ7vVfM6lw2a+xc45g8sV7Trs/c6rHcNE8+zRriMcLeWUxO/hjWmhe/rpzLHTusUGWx5LAC4n2My0nutTYQT8LMpGiDRSmcVfsWLJl8e4FAt55RbmTrWYKbItfqtcgELs/u8hTsZprAeoSes1PoJqHRAcEuyxMeLpvOm06LG49wedemKxDucla0mo+FKNa/F2zChNu8hvpYCHj+NsoFew02fbimK5DKkh7O26saBraYs7H0eeqHNQwNAovI1pord6E96g8S/a0u87YXezvvZPdO1R6MtE7t2aRaZZ5w18OYtTuMc8oQqlMvb9cyDZGibuWvVhzZFBrGebXV7eb54ZxlDpzvsJNwtb14SMzc0ZNhwn888vdOq0D/00K5SI7naoQyDTPX7/9E7frivbOXl5hPfvOUKd2duFkqPPPYAr5P5/Jx8/gYC9f/gnKNaQFXGM4C3qODRQs4zlyYu3dqdHDNwr3PVMdN4ag0nGfcYKTmkon7EdGOpoZ5gwvM1R8XZojZfsnSlw8UMnNTw6zVqdMQOc0s/31a/A4LRZ8HOQ+LURfHcYEzmvpRrwu0MJ+4yXWzYXtZ7U5cZqtKBccfckpcOZvHEMeJbu7lbcM7MxxIxR4cTygpTfO24FxnCbrcpD04AbLh6x9GxwFOny17HSuhy5NUn7C3xRkzbW96SBgS3+wD9nzGWC5m86Br3yiXQsgCLjAu3HU1bY6m6QSWB6wpfBbAWS5StD0Vu3E54e59ztVcJLCHJ1SLgBKBrghEeDNKYF1T4PEKQv9lO/+aIO9nEA6jCMHdTYEx0orFDjsm5xKCbzpU1H65fEagJ/HT2w2c/QI6FfoYu86Xnjsa70H0Mkxa++T0JS6XUkYYe77nui1qKSbn1x5uKNpNENwT3ovLZ0bYMIxc27qeUH6owLEedX9UhqMJ3UbmBSYb3zvpB9Jtj/5nD1Q3pt7LWiPkU3fPtaiahr4gTRrgugE+AmzL+M+WTc2NyaNaCK9cJnIs96Y1DWb0fR9l9k3hPZUNPDCOGjQDYHkv1VnppqQsVrQYN7ZCBcK8cRxvyw93FJ/1XwH3SK6KK0q6ryH5Aw0OYt1A1ErZPbxyvbiclVwXhE1L4TmA5TetUyost28LNJkwfbMP5IEsEGs1uTKFgatsHjsqLL+DLHSA7CFU0eblemh/j7exrk4fau57Zf0WVGFluFcAPEWu4Mjegn4XNFj9D18cRttADn2DnYQXuIubvWHJB+A2PzCMIgDWDmIIsFQC8r2B4UngrkumcOoXMKRqA8K1FoAb5rDkBk0+HhBmgAtfHRNhAQ4pdiB4BwyluZQVLHkBHB4Ivg0avC9ZwigMZO8AcBy487w1LLEAHhWoYX4ewPo5pwcsbQDZTQ0fA/dC6gsWgxp8kKKFFzX38Fl/sHQCmvyGEkagwcav9YT5Nqgig8Oter+wuty8Cu0rvjkVxqb23rA0pcG0z1hdAUSQDdjTXw0xg/O/d913+HGCCSydKXCGuoCI0St3hnCMYQbziX6mRotJopAuEic4M1hC3qng6P6zoZxlmsLDPET9z2BGhd3OwmcqnHEWFv+U3dvIWVia/nTtrmcdP6H3hI9WPpdE2sulfwUYAL2Srno9RZCmAAAAAElFTkSuQmCC';

export const customMedia = {
  pcScreen: '(min-width: 835px)',
  mobileScreen: '(max-width: 834px)',
  minimalMobileScreen: '(max-width: 359px)',

  pcLayout: '(min-width: 835px)',
  mobileLayout: '(max-width: 414px)',
  bigMobileLayout: '(min-width: 415px) and (max-width: 600px)',
  tabletLayout: '(min-width: 601px) and (max-width: 835px)',
};

export const keyframes = css`
  @keyframes SpinnerRotation {
    0% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
    5% {
      transform: translate3d(-50%, -50%, 0) rotate(30deg);
    }
    14% {
      transform: translate3d(-50%, -50%, 0) rotate(60deg);
    }
    23% {
      transform: translate3d(-50%, -50%, 0) rotate(90deg);
    }
    32% {
      transform: translate3d(-50%, -50%, 0) rotate(120deg);
    }
    41% {
      transform: translate3d(-50%, -50%, 0) rotate(150deg);
    }
    50% {
      transform: translate3d(-50%, -50%, 0) rotate(180deg);
    }
    59% {
      transform: translate3d(-50%, -50%, 0) rotate(210deg);
    }
    68% {
      transform: translate3d(-50%, -50%, 0) rotate(240deg);
    }
    77% {
      transform: translate3d(-50%, -50%, 0) rotate(270deg);
    }
    86% {
      transform: translate3d(-50%, -50%, 0) rotate(300deg);
    }
    95% {
      transform: translate3d(-50%, -50%, 0) rotate(330deg);
    }
    100% {
      transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes fade-in-slidedown {
    0% {
      transform: translateY(-40px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes fade-out-slideup {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-40px);
      opacity: 0;
    }
  }
  @keyframes fade-in-slideup {
    0% {
      transform: translateY(40px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes fade-out-slidedown {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(40px);
      opacity: 0;
    }
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }
`;

export const maxPcContentWidth = '900px';
export const minContentWidth = '320px';
export const mobileBlockedSearchHeight = '44px';
export const mobileSearchVerticalInnerPadding = '4px';
export const defaultFontFamily = 'Noto Sans KR, NotoSansKR, Sans-serif';

export const resetLayout = css`
  margin: 0;
  padding: 0;
`;

export const resetAppearance = css`
  border: 0;
  appearance: none;
`;

export const resetFontUnlimited = css`
  font-family: ${defaultFontFamily};
  letter-spacing: -0.03em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

export const defaultFontStyle = css`
  color: #40474d;
  line-height: 1em;
`;

export const resetInputFocus = css`
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

export const resetButton = css`
  ${resetLayout}
  ${resetAppearance}
  background: none;
  line-height: 0;
  box-shadow: none;
  cursor: pointer;
`;

export const resetList = css`
  ${resetLayout}
  ${resetAppearance}
  list-style: none;
`;

export const resetHeading = css`
  ${resetLayout}
  ${resetAppearance}
  font-size: inherit;
`;
