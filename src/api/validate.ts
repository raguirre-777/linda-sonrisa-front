/* eslint-disable no-useless-escape */
/* eslint-disable eqeqeq */
export const ValidateRut = {
  rut: function(rutCompleto: string) {
    rutCompleto = rutCompleto.replace('‐', '-');
    rutCompleto = rutCompleto.split('-').join('');
    rutCompleto = rutCompleto.split('.').join('');
    rutCompleto =
      rutCompleto.substr(0, rutCompleto.length - 1) +
      '-' +
      rutCompleto.substr(rutCompleto.length - 1, 1);
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) {
      return false;
    }

    var tmp = rutCompleto.split('-');
    var digv = tmp[1];
    var rut = parseInt(tmp[0], 10);
    if (digv == 'K') digv = 'k';

    return ValidateRut.dv(rut) == digv;
  },
  dv: function(T: number) {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : 'k';
  },
  runFormat: function(run: string): string {
    if (run.length > 1) {
      run = run
        .split('-')
        .join('')
        .split('.')
        .join('');
      const dv = run.substr(run.length - 1, 1);
      const rut = parseInt(run.substr(0, run.length - 1));
      if (isNaN(rut)) {
        return run;
      }
      if (rut <= 0) {
        return run;
      }
      let num = rut
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(?=\d*\.?)(\d{3})/g, '$1.');
      num = num
        .split('')
        .reverse()
        .join('')
        .replace(/^[\.]/, '');
      return num
        .toString()
        .concat('-')
        .concat(dv.toUpperCase());
    }
    return run;
  },
};
