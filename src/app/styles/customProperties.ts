import { css } from '@emotion/core';

import Colors from './colors';

export const graySpinner =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWU0ODQ4My1hNmFhLTQxMjctOGQ5NC0yN2JiODQyZDRmNzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjUxQjQ1M0YzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjUxQjQ1M0UzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZDE1YjljYzgtNzdhYy00N2JiLWJlNTEtNzRjNjA1MzE4NDFhIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWZlMTFkZmItYjlmNi01YjQ5LWIyNTctMDc2NDM4ZmJiOTRiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fCp2XAAAAYBQTFRF0tXYrrK54+TmjZOc0NPWpaqx9PX26uvt8PHyqa60oaatjpWesra8sLW7mJ6m3uDjztDU7O3u1dfb19nc6+ztwsbKm6CouLzCvsLHhYyWnaKqwMTJkpihvcDGgomTx8rOrLC3n6SsipCaiI+YoqeuhIuVj5aezM/Ttbm/5ufpv8PI8vP02dveq7C3l52lgIeR/v7+/f39/Pz89/f4+Pj59PT19vf37u/wxcjN3N7h8/P05ebo5+jq+vr6+vr7+/v78/T13d/i+/v8t7vB4OLko6iw2tzfp6yz9vb36Onr9fb21NbZ+fn5+fn67+/x7e7v8fLzys3R4eLl6ersur7D293gzdDUtrrAxMfM3d/h2Nrd5Obo8vLzu7/Ey87S7/Dx4+Xn4OHktLi+yMvP0dPXz9LW3N7g4ePl5efp3t/ilpykzc/TyczQuLzBt7vAkZegvL/FyMvQwcXKxsnOg4qUwMPI4uPmwsXKxsnNo6ivoaeuvMDFvsHGlZukk5mi////Oag5iQAAAIB0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA4BUtnAAAGZklEQVR42uza/VPaSBgH8IAKSKkCvo7Uq3fXChiCmxBEaXmptRSQF634VtuxKvTtrr22M3fXuWsv//qp5OVJdknIUnIzN/3+yBA+brL77EtkJNqw5yOrPy95aS9naC+M/7R6lbtPHYYLy6vd3D11Fg6uKplzFnap8ISz8GMVXv5/wVuur7+NdXjH4aOR63A5h+GnI3JaDsN+BR6JOwoj1R0ZcxTmNXgk7OitXtbgiZyT8Dlo8oyTcPOGBi/7nBzH86DJASdh8S2Q3U6WzDaA/chBGPmBPOrk7OQG8FvRyWkxAOR5J2EfqCI3mk4uBI5Ak11OwrkJIL9xcukTBvACPxSY54nfGQNy9NvD4sxsMvlXUCBsGgD8T7X72bgK/zMgXB1LXufRBv6l90B+3v2opcJj/UF8KsuyngIOv08quRkyXpS+BYZUvnsXVLjdD4tEthvRCNeSWiYia4brPoImN7ofxWRXV8F7jowiq0QwwI0kzEJb382EWQ2eltvQ+uHKXapbs4KH1VI2wJmkPmOvdNeWNHhH+ex098P6Xh93eY2FKRrgctKYc93+c1xxvyJ7vVfM6lw2a+xc45g8sV7Trs/c6rHcNE8+zRriMcLeWUxO/hjWmhe/rpzLHTusUGWx5LAC4n2My0nutTYQT8LMpGiDRSmcVfsWLJl8e4FAt55RbmTrWYKbItfqtcgELs/u8hTsZprAeoSes1PoJqHRAcEuyxMeLpvOm06LG49wedemKxDucla0mo+FKNa/F2zChNu8hvpYCHj+NsoFew02fbimK5DKkh7O26saBraYs7H0eeqHNQwNAovI1pord6E96g8S/a0u87YXezvvZPdO1R6MtE7t2aRaZZ5w18OYtTuMc8oQqlMvb9cyDZGibuWvVhzZFBrGebXV7eb54ZxlDpzvsJNwtb14SMzc0ZNhwn888vdOq0D/00K5SI7naoQyDTPX7/9E7frivbOXl5hPfvOUKd2duFkqPPPYAr5P5/Jx8/gYC9f/gnKNaQFXGM4C3qODRQs4zlyYu3dqdHDNwr3PVMdN4ag0nGfcYKTmkon7EdGOpoZ5gwvM1R8XZojZfsnSlw8UMnNTw6zVqdMQOc0s/31a/A4LRZ8HOQ+LURfHcYEzmvpRrwu0MJ+4yXWzYXtZ7U5cZqtKBccfckpcOZvHEMeJbu7lbcM7MxxIxR4cTygpTfO24FxnCbrcpD04AbLh6x9GxwFOny17HSuhy5NUn7C3xRkzbW96SBgS3+wD9nzGWC5m86Br3yiXQsgCLjAu3HU1bY6m6QSWB6wpfBbAWS5StD0Vu3E54e59ztVcJLCHJ1SLgBKBrghEeDNKYF1T4PEKQv9lO/+aIO9nEA6jCMHdTYEx0orFDjsm5xKCbzpU1H65fEagJ/HT2w2c/QI6FfoYu86Xnjsa70H0Mkxa++T0JS6XUkYYe77nui1qKSbn1x5uKNpNENwT3ovLZ0bYMIxc27qeUH6owLEedX9UhqMJ3UbmBSYb3zvpB9Jtj/5nD1Q3pt7LWiPkU3fPtaiahr4gTRrgugE+AmzL+M+WTc2NyaNaCK9cJnIs96Y1DWb0fR9l9k3hPZUNPDCOGjQDYHkv1VnppqQsVrQYN7ZCBcK8cRxvyw93FJ/1XwH3SK6KK0q6ryH5Aw0OYt1A1ErZPbxyvbiclVwXhE1L4TmA5TetUyost28LNJkwfbMP5IEsEGs1uTKFgatsHjsqLL+DLHSA7CFU0eblemh/j7exrk4fau57Zf0WVGFluFcAPEWu4Mjegn4XNFj9D18cRttADn2DnYQXuIubvWHJB+A2PzCMIgDWDmIIsFQC8r2B4UngrkumcOoXMKRqA8K1FoAb5rDkBk0+HhBmgAtfHRNhAQ4pdiB4BwyluZQVLHkBHB4Ivg0avC9ZwigMZO8AcBy487w1LLEAHhWoYX4ewPo5pwcsbQDZTQ0fA/dC6gsWgxp8kKKFFzX38Fl/sHQCmvyGEkagwcav9YT5Nqgig8Oter+wuty8Cu0rvjkVxqb23rA0pcG0z1hdAUSQDdjTXw0xg/O/d913+HGCCSydKXCGuoCI0St3hnCMYQbziX6mRotJopAuEic4M1hC3qng6P6zoZxlmsLDPET9z2BGhd3OwmcqnHEWFv+U3dvIWVia/nTtrmcdP6H3hI9WPpdE2sulfwUYAL2Srno9RZCmAAAAAElFTkSuQmCC';

export const blueSpinner =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWU0ODQ4My1hNmFhLTQxMjctOGQ5NC0yN2JiODQyZDRmNzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEE3RjI5Q0UzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEE3RjI5Q0QzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NWE2ZjBjNi1mYWFmLTQ0YzUtYjk2MS1hZDA4MjM2ZGE1M2YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NmVlNDg0ODMtYTZhYS00MTI3LThkOTQtMjdiYjg0MmQ0ZjcxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+12eFdwAAArtQTFRFpdL1fb3w6PP8j8byWavsu9330uj6Nprpa7XvR6LrH47m+/3//f7//P7/7fb9+fz+7/f9yeT5wuD46/X98Pf96fT90Oj69fr++vz+sNf28/n+2uz7gb/x8fj9w+H4+Pv+6vT99/v+mcz0dLnw9vv+Xa3tOpzpjcXy9Pn+rNX24O/8ZLHuTqbr7vf9s9j28vj+9Pr+7PX94vD83e775vP85fL82+370+n6vd743u771On61ur62ez71er6p9P1z+f6xeL5utz3zeb5vN343O374fD8tdr3lsrzqNP1isTy5/P81+v65PH84/H8f77x0Of6yOP53u/7qdT1vt74v9/41+v7lMnziMPymMv0zub6kMfznc70rtb2zOX5brbvweD4q9T2hsLxh8Ly0ej6gcDxodD1xOH4t9v3yuT5gsDxrdb2l8vzsdj2s9n3d7rwptL1otD1x+P5VansZ7LuSaPrcLfvR6Lqo9D1hcHxudz3TqXrlcnzfL3wksjzn8/0crjvdrrwtNn3nM30TaXraLPue73wSqTrkcjzhMHxpNH15vL8c7nvpdH1jsbyebzwns70QZ/qYa/t3+/7msz0bLXvj8fzeLvwwN/4stj22Oz7r9f2y+X5m8z0OZvpZbHuT6brW6ztXK3tuNv3cbfvO5zpPZ3pgL/xX67tYrDtXq7tbbXverzwttr3abPuY7Duk8jznc30OJrpg8Hxb7bvYK/tIo/mWqztI5Dmfr7xMZfoU6jsdbnwJJHnTKXrRaHqebvwxuL5qtT1J5LnjMXyJpLnNZnoOJvpP57qUafsi8XyMJboLZXoKJLnoM/0JZHnLJXnQJ/qVKnsKZPnQJ7qV6rsIY/mK5TnL5boPJ3parTuII7mPp7pRqHqUqjsN5rpQqDqKpPnUKfrZrLuicTySKPrVqrsa7TuS6Tr////J0gIWwAAAOl0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBqIGXNAAAGxklEQVR42uzb/28TZRwH8Nut3do9197WUVo6y1op0Ipza7eyDQaMfR/jy74yYAy3wAjMOY2yhPFF0ABDBJGBghoiUUTlixKCBkkgxBiR+Iu/mugPJsbcn+G669197u7pfXnqzsTw/vHSuxfP3T2f53N3g+JIs+54fsEvF+pId6dId6z+viCVH9daDIeXFPD5Yb21cHeBkL3Wwp+J8ANr4WUivOT/BRdNPPz8bgxZDrfmz+aWz2J4bX46dyyGbQKcX20pzIhu/l1LYSTB+W9aeqqvSvA+n5XwDTDkg1bC05cl+GrSynl8Bgz5qJVw4HcgD1pZMkcBbEMWwi4bkGNWrk4NAH5YbuWyOA7kM1bCSVBFfuqyshFoBUPeYSXsOwHk3Va2Pi0Avo/mBEYI+5tzQH7734cDm/90Or/rZjEPDQB+z81vOybCv2YJu790zmaxR/2ja0Ae5jftF+FzxiA0z0vT7rAavuYUsqhSuVPosQRfjvBnQYRHjbBMOc0noISjTil/TRUq9jsLhpzgNx1KuzbGgOsL0UJYBZxwwvw8Kr/N2E8kuCldxYe/TbkXovos66allCngZqc8XxfJ9q2R4FPCtg0j/c/26bOuQhompIDLnMocT8Ddj4krhcvc3Rvwylzaq7y5jqnkE1vAaWx+nKHd1E6kmFbErYTrDqhk52st0p2T9yDFLomZYf1uWhWfqoDULVPLzls7pYm4qWXsUcAE65qnZsV7C5ZMNPoHhj65jvBBtsKLcYP4Wl04tU8tHxhBBGxpMYZ1+zOuTpWLMIMe95tlEebi0sURzWXRs1gtj5h0/Ziz7A3orccs9bwSvm8SxpzmQpeBRiDer5TD5gasvriswQ5k5XU5HDFXNRRsyGei9VlrgzWMyQYuZ0z1XL6BByLcb+4Ss7KKgUw3e1W70u4VtzmYkW7qeClRl7nm75T7AW12GvuEKVRB3N4WNifKCepWJNVxeIPMXLyv1lshEJqbd5lZ5ylsJewebd+Izd6XiuYS/vgLW+acDJMfmi0L4RNPrZBU4iubVg4Tu8m8zOmLcNRhm3bKCN2qPK2sRNQyHXgFmYuqNeG8JKXj2rYS9pjabl4H9ZsO/CEZXK4D51ED2u6VKBkc1XFXUe7XNWHSAoN04ATFdV3XcM8ypLMpoemuCFOpG/DmAmwueWjy8uGq1XKDc1mrgxtqK7GZ9qKny+JTmA0l3S7r4XJqh8PhONpJUj8qKlhSGNnfcfDxmG6rG+wzKXITwdXPOIRM+Ey+hvDY+cyPmIbXbXaArDQHV9uF1CxHpmDf0HXoOh6ZgxvtUjynjMMuz7hDHnPNJrLLUjTPIFw37FCmydzyYFekutQAHD+vYh2HTL7ouqiUe2pdOnDp2ITaPVJrcjY12VVZSGvCne+qWcc2r9lpzDSoZftg5vdcXe0Y9t4agrrFVNZg6A4WC5eexrBHJsHl9bPG+6DITozc28yoYdcUxh2RZgJq3J+Ts3FI472E/1RTbUg6clknhn6kfnvrUbNPpsEUOZszmycZn2hKVlMz+ahY2rL+RbXcE1TCqut7Q1Y1anLSeSODW0vx6QbnBNU1quROJXxEzk5ckk36sl0CnJOh7sfSMGWXPcisUcnK707yKvlWXH7YNtHNEc9lNFGbFJ+eo5SYZnlBqlfAFQq4FbDDJYrhdEluTvq7kb8ldybbPOm7qVCCx+RVimnu1YT7RHbco5w1zEEAp5+lYrl8eoRmRYrywZbtgDBSzuNLPLsjpl719wC3ld+0PFcI/xkSrZbgbtURAoOiO19duRpmVqWJAcxDS7gfwOkvrZMivIrfUASGjFm+6YW8W89iazW+obwJXOHnQyK8J/2vGwJyHLNWTs/0Q719yERfXbxRcq8J/VubCAvTvQPAk/gKzphr6F8FAxb/wlcNMy8A2cBCqgvXAbe9NDPMJQG8HWUNu7YBWHoRg4G5HiBvyhquB+4WThMOviLBbdEs4ehJACe0YW4QDNmTJTwGXPjpGAuzMSDTWcFV9yR3b1AP5koA3JIVfBsM+CKnCzMtQC7JAq4G7lKkD3M0gGN+YhgtBbB8zckAcx4gDxLDHuAOcIbgaJsErw6Swu2Se6/KGMxtAkPeTQi7wIDHOIMw2g6GnD28P2oUFtvNVEg/8d0R4XrOMMxNSjDpNX5ZcKdcJuC4sRqiBUfe591dSc4ELHVBzxEXkMDplLsZ899stGDUyLvzs1kkwsUh7AKnBXNMyafdsd6qOXmXqQnP5UvU/wxeIMJbrYU7RbjZWjjwTdq97bIW5poOz7pbvJzFMBdvac09XxMl3Z37R4ABAAOAKs7JzW9fAAAAAElFTkSuQmCC';

export const brownSpinner =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWU0ODQ4My1hNmFhLTQxMjctOGQ5NC0yN2JiODQyZDRmNzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDE5M0RCMTIzMERCMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjUxQjQ1NDYzMERBMTFFOEJEOTlGOTE4NkI2OUQ4ODgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDZmODVjMWItMTQ4ZS00NDFiLTk5MmMtYTQwY2ZjZjg5MzQ5IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDdmZWFlYjUtZDU0ZS02NzQ1LWJhZjYtN2MwYTBiNjBiNWM0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dQBkXgAAAYBQTFRF8uzi8OjczbSOxql9sYlM1L6d2MSm49S+072atI1T8uvh4tK8uZVe6uDQzrWQr4ZIzLKK3cyy28is6NzK6t/O4NC47OPV7eTWu5hj9fDp5dfD3Mmu2seqyKyBxKZ55trGwaJy3cux38612caoupZg18Oly7GJvp1qv55tw6R11sCg38+20bmV18Kj9/Ps7+fa59rIxKV3yq+Gt5JbvZxp/v7+/Pv5/v79/f37+fbx+/n26d7N/fz6+PTu+fby/v387OLT+vfz0ruY9/Pt+/j17ubZ/fz75NbB+vf0/Pr4/Pr3wKBv9/Tu8+3kxah79O7m1sGi7uXYyKuB+PXv+PXw+vj09e/n9vHp59vJ9vLr7+fb8erf4NC39O/n59vI9/Ls1cCg0bqW6+HS4dK78Ondya2E6d3M4dG6vZto38+37+ba3s2zwJ9u18Ki5djE5tnF5tnG0rqXwqN0y7CH0LiU9vHq0LiT0LeT0bmW9O7l49W/x6t/yq6F5djDt5FZ/////4FUoAAAAIB0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA4BUtnAAAGcElEQVR42uza/VPaSBgH8LQWyoEvtL6j02q91k7F8CIhAYKxQC1Q6J2Hgu+1itrry7Q9r2/Yufzrp5KXJ9klyS4lN3PT74+M4TMbdp99spGRacN+Xhr65cxPezlDe+H2P0OXuXHXZTjZP9TOjUl34dEhNTl34aAGP3QX/kOD+/9f8Erw1a99R5Lr8PTSVb6XXYajS0p8LsMxFV7adhXmNHepz1VY0uGlkKu3ul+H58tuwl/AkOfchKtgyP0NN9fxOzDkQTfhwisgj7lZMgMAjvEuwnwMyAE3d6dxAL/acHNbHATyOzfhBlxSVTcbgWkw5AduwuV5II+42fqEADwj9AQWJOzfnAP53o+HC3PPEok7oyLmoQHAE6n2Z8caPNElnDpPXOV5Bv2jj0D2tD/yaXCfM0h6nGfZ9SQKf0youY787tkJsKRK7bugwQEnLLfBtlMww+mEnnnvsum6WTDkevujsOLGOAduucKqEU1wPQEzEzBOM/GZDitX8J4r9yxtz4rrrJ6UCd5LGHNu2ATlTR3eUj+bvOW5vWPP8sssTMUEpxLmfDY8fx5rOwVPNnsLeYPL5s2T6xiR56fBbdyb6NBuWqeUZU1ZN8P+t4ic+Cukz5zIw6s5fUTCrqZYJGWkgPjPUTnx/bVe1tZCrYECAcs/RlltbsGSKQVmMLTvBeWDbDqPcYv4Wr3snUflt7ckmjOSLIZdX+24OzHXMYMeXCVlJcyPy2ZLltti5jkq3yJ0VzF3OV+w24/FhWdmeIYQxtzmZd5BI1A7MMtJsgEjbE102IE0z4xwiaxqmNhKmaD1uRuDNYzrBt7giHqu8pReyjxkP7FoqBgScbO3lVPcOykymNMndS1J1WWuxa+WMUu6jMvqEkpTt7fLe/UNirpVuuw48kWuF+fVdjuEIPXmLLPr/ITdhFOBg5fY5KZXegmP9cU6x5ek/2oxVcGndrlDMvXnMat4qd1GpHN2SjLjjVknReluRazSFJhzG/ganSttW8KRBmPjxsYpe0xrN9JkvtvAO3Twhg0cYaas3Tvp3oz4GpM6toQXKOeWYAPXGbl6ZuHOcrSrqW494ORF5ZIioZvYtE5Y+vLBV63cYi9rdXGyymDzLS/83BZ/wmKlsc65D28sPIjH44OHNPUjnRZpYSl6Pd5OhritHo9eZCVFBUdycTXBMuExRCbazpMSMbw1FwdpksHbUTWbjEQEl0/PoBsfIIP3o3oyn5zDfGYwbgxZsylFDVl57BD2++LmkC12PmrKdtIBXLuNsPG/CQ+6TszycJW3gZOtIOoGq6S1IYpkhLWED7+gbPx+hXQZc+OoHB3rfM5VPcCwX9co6hbHbGLopoiFk/cwbPCDAI6vROdlu/QaI5/scSjMezHuG30lCPu+cPjlqcW5xOonplrRvzl1iKEH0NPbDMo++gaWyGz4Ko861l//7sJFbmb1TyZPUHm4aIaR3/eLoWpshpXMdnCrC+2Mgnsi+PcR+dAMm5ZRsGWYCamcCoc71P2AAi9EDW39GiKb3zsZq+RUzfi1u5ob1u5lul5taCUpvaClbixIAyY4bYLhbuQx/7NlVXfDyqoWQ4sXuZ9RZtOyDreMVYrbO7GEdzR2cMS8arg5ACsXHi22s6k2K3rMD7ZiE8KCeR232uyDALrrjwFX+ZcfZlFN+zWktKvDo8g0KIxp7hO0co17LubUFOahJekBsPL3HzRYGd8KGDJm+2ZHlIUsYms1/u1dCLjqw+OpBivvIJOnQK5h9spvF/3Q8I5A0FdnX+ruR7V+jGqwutybAP6Ar+AcWUP/BgxYW6QozD0FsoON1Bb2A/cg2RmWGwAOCF3D/H0A6wcxGFgeBvKTruEB4E7LlnDxT7Ck0l3CaR+A69awPAaGnOkSbgEXvjrGwuIRkNmu4K2vupsr2sGyH8ChruApMOAT2RbmQkD2dwFvA/edYA/LLFxSq9Sw8DuAjXtOB1jOAHmMGs4Ad0p2BBdGdXi3SAsf6O7XF85geQ0MeYQS5sGAW7JDWAiAKtI97Es7hbV28zK0r/j0qoVs7Z1h+b0O0/7GT1XXyxPANWc1xAouKTtTriETwPKhCu9RF5DCvav+DnUtYWHfydZos0kksxXsBmcFy5z//Whg+EVPzjIt4V4eov5n8E0NHncXPtTg39yFC17FneLdhWWmLU/nXT+hr4XmFm9vFmgvl/8VYADLvR1c4R0s4AAAAABJRU5ErkJggg==';

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

export const mobileBlockedSearchHeight = '44px';
export const mobileSearchVerticalInnerPadding = '4px';
export const defaultFontFamily = "'Noto Sans KR', Sans-serif";

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
  color: ${Colors.slategray_80};
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

export const hideScrollBar = css`
  overflow: -moz-scrollbars-none;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    appearance: none;
    width: 0;
    height: 0;
    display: none !important;
  }
`;
