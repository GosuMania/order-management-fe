export const UTILITY = {
  regexPrice: '\\d{1,3}(?:[.]\\d{1,3})*(?:[,]\\d{2})([ ]|[\S\t\n\r]|[ ])[€]',
  regexPrice2: '\\d{1,3}(?:[.]\\d{1,3})*(?:[,]\\d{2})[€]', // x.xxx,xx€

  syncText(text: string) {
    if (this.checkText(text)) {
      text = text.replace(new RegExp('\'', 'g'), '\\\'');
    }
    return text;
  },

  syncPrice(price: any) {
    if (this.checkText(price) && price.match(this.regexPrice2) !== null) {
      price = price.substring(0, price.length - 1);
      price = price + ' €';
    }
    return price;
  },

  checkText(value: any): boolean {
    return value !== null && value !== undefined && (value + '') !== '';
  },

  checkObject(obj: any): boolean {
    return obj !== null && obj !== undefined;
  },

  replaceSpecialCharacters(specialWord: string): any {
    if (this.checkText(specialWord)) {
      specialWord = specialWord.replace(new RegExp('\'', 'g'), '\\\'');

      while (specialWord.includes('*')) {
        specialWord = specialWord.replace('*', 'x');
      }
      while (specialWord.includes('_')) {
        specialWord = specialWord.replace('_', ' ');
      }
      while (specialWord.includes('{')) {
        specialWord = specialWord.replace('{', ' ');
      }
      while (specialWord.includes('}')) {
        specialWord = specialWord.replace('}', ' ');
      }
      while (specialWord.includes('\\')) {
        specialWord = specialWord.replace('\\', ' ');
      }
      while (specialWord.includes('#')) {
        specialWord = specialWord.replace('#', ' ');
      }
      while (specialWord.includes('`')) {
        specialWord = specialWord.replace('`', ' ');
      }
      while (specialWord.includes('®')) {
        specialWord = specialWord.replace('®', '');
      }
    }
    return specialWord;
  },

  forceHttps(url: string) {
    if (this.checkText(url) && url.includes('http:')) {
      url = url.replace('http:', 'https:');
    }
    return url;
  },
  importToNumberWithoutPoint(importo: string): number {
    let num: any = null;
    if (this.checkText(importo)) {
      importo = importo.replace('€', '');
      importo = importo.replace(',', '');
      importo = importo.replace('.', '');
      num = +importo;
    }
    return num;
  },

  checkObj(value: any): boolean {
    return value !== null && value !== undefined;
  },

  importToIntNumber(inputPrice: any): number {
    inputPrice = inputPrice.replace('.', '');
    inputPrice = inputPrice.replace(' ', '');
    inputPrice = inputPrice.replace('€', '');
    inputPrice = Number(inputPrice.replace(',', '.'));
    return Math.floor(inputPrice);
  },

};
