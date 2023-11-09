export const titleCase = (str: any, replaceunderscore = false) => {
  try {
    if (replaceunderscore) str = str.replace(/_/g, ' ');
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i][0].toUpperCase() + splitStr[i].substr(1);
    }
    str = splitStr.join(' ');
    return str;
  } catch (err) {
    return null;
  }
};

export const capitalize = (str: any) => {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toFixed = (num: any, fixed: any) => {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
};

export const isFormatCode = (code: any) => {
  return /[k-o]/.test(code);
};

export const isColorCode = (code: any) => {
  return /[0-9a-f]/.test(code);
};

export const renderLore = (text: any) => {
  let output = '';

  const formats = new Set();

  // @ts-ignore - this regex always matches so we don't need to check for null
  for (const part of text.match(/(§[0-9a-fk-or])*[^§]*/g)) {
    if (part.length === 0) continue;

    output += '';

    if (formats.size > 0) {
      output += `${Array.from(formats, (x) => '§' + x).join(' ')}`;
    }

    output += `${part}`;
  }
  return output;
};

export const formatNumber = (number: any, floor: any, rounding = 10) => {
  if (number < 1000) {
    return String(Math.floor(number));
  } else if (number < 10000) {
    if (floor) {
      return (Math.floor((number / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'K';
    } else {
      return (Math.ceil((number / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'K';
    }
  } else if (number < 1000000) {
    if (floor) {
      return Math.floor(number / 1000) + 'K';
    } else {
      return Math.ceil(number / 1000) + 'K';
    }
  } else if (number < 1000000000) {
    if (floor) {
      return (Math.floor((number / 1000 / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'M';
    } else {
      return (Math.ceil((number / 1000 / 1000) * rounding) / rounding).toFixed(rounding.toString().length - 1) + 'M';
    }
  } else if (floor) {
    return (
      (Math.floor((number / 1000 / 1000 / 1000) * rounding * 10) / (rounding * 10)).toFixed(
        rounding.toString().length
      ) + 'B'
    );
  } else {
    return (
      (Math.ceil((number / 1000 / 1000 / 1000) * rounding * 10) / (rounding * 10)).toFixed(rounding.toString().length) +
      'B'
    );
  }
};

export const floor = (num: any, decimals = 0) => {
  return Math.floor(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
};

export const round = (num: any, scale: any) => {
  if (!('' + num).includes('e')) {
    return +(Math.round((num + 'e+' + scale) as any) + 'e-' + scale);
  } else {
    var arr = ('' + num).split('e');
    var sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    return +(Math.round((+arr[0] + 'e' + sig + (+arr[1] + scale)) as any) + 'e-' + scale);
  }
};
