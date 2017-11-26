export const HSLA =(...props)=>{
  const [ h = 0, s = 50, l = 50, a = 1 ] = props.length === 1 && typeof props[0] === 'object'
  ? [props[0].h,props[0].s,props[0].l,props[0].a]
  : props;

  const bounds=(val, min=0, max=100)=> Math.min(Math.max(val, min), max);

  const saturation =(val)=> HSLA(h, bounds(s+val), l, a);
  const light =(val)=> HSLA(h, s, bounds(l+val), a);
  const alpha =(val)=> HSLA(h, s, l, bounds(a+val));
  const css = `hsla(${h}, ${s}%, ${l}%, ${a})`;

  return({
    saturation,
    light,
    alpha,
    css,
    h, s, l, a,
  })

}
