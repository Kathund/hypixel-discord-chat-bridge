export const titleCase = (str: string, replaceunderscore = false): string => {
  try {
    if (replaceunderscore) str = str.replace(/_/g, ' ');
    const splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i][0].toUpperCase() + splitStr[i].substr(1);
    }
    str = splitStr.join(' ');
    return str;
  } catch (err) {
    return str;
  }
};

export const capitalize = (str: string): string | null => {
  if (!str) return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toFixed = (num: number, fixed: number): string => {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  const match = num.toString().match(re);
  return match ? match[0] : '';
};

export const isFormatCode = (code: string): boolean => {
  return /[k-o]/.test(code);
};

export const isColorCode = (code: string): boolean => {
  return /[0-9a-f]/.test(code);
};

export const renderLore = (text: string) => {
  let output = '';

  const formats = new Set();
  const matches = text.match(/(§[0-9a-fk-or])*[^§]*/g);
  if (matches) {
    for (const part of matches) {
      if (part.length === 0) continue;

      output += '';

      if (formats.size > 0) {
        output += `${Array.from(formats, (x) => '§' + x).join(' ')}`;
      }

      output += `${part}`;
    }
    return output;
  }
};

export const formatNumber = (number: number, floor: boolean, rounding: number): string => {
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

export const abbreviateNumber = (number: number, rounding = 1): string => {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    return Math.floor(number / 1000) + 'K';
  } else if (number < 1000000000) {
    return Math.floor(number / 1000000) + 'M';
  } else {
    return (
      (Math.ceil((number / 1000 / 1000 / 1000) * rounding * 10) / (rounding * 10)).toFixed(rounding.toString().length) +
      'B'
    );
  }
};

export const floor = (num: number, decimals: number): number => {
  return Math.floor(Math.pow(10, decimals) * num) / Math.pow(10, decimals);
};

export const round = (num: number, scale: number): number => {
  if (!num.toString().includes('e')) {
    return +(Math.round((num + 'e+' + scale) as unknown as number) + 'e-' + scale);
  } else {
    const arr = num.toString().split('e');
    let sig = '';
    if (+arr[1] + scale > 0) {
      sig = '+';
    }
    return +(Math.round((+arr[0] + 'e' + sig + (+arr[1] + scale)) as unknown as number) + 'e-' + scale);
  }
};
