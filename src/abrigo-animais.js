// registro dos animais existentes
const registroAnimais = {
  Rex: { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
  Mimi: { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
  Fofo: { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
  Zero: { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
  Bola: { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
  Bebe: { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
  Loco: { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
};
// separando uma variavel para os brinquedos
const registroBrinquedos = ['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'];

//clase principal 
class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const brinquedosDaPessoa1 = brinquedosPessoa1.split(',').map(b => b.trim());
    const brinquedosDaPessoa2 = brinquedosPessoa2.split(',').map(b => b.trim());
    const animais = ordemAnimais.split(',').map(a => a.trim());

    // Validação de animais pra saber se sao validos e unicos 
    const animaisUnicos = new Set();
    for (const animal of animais) {
      if (!registroAnimais.hasOwnProperty(animal) || animaisUnicos.has(animal)) {
        return { erro: 'Animal inválido' };
      }
      animaisUnicos.add(animal);
    }

    // Validação de brinquedos pra saber se sao validos e unicos
    function brinquedosValidos(brinquedos) {
      const vistos = new Set();
      for (const b of brinquedos) {
        if (!registroBrinquedos.includes(b) || vistos.has(b)) return false;
        vistos.add(b);
      }
      return true;
    }
    if (!brinquedosValidos(brinquedosDaPessoa1) || !brinquedosValidos(brinquedosDaPessoa2)) {
      return { erro: 'Brinquedo inválido' };
    }

    //
    function ordemDesejada(listaBrinquedoNecessarios, listadeBrinquedosObtidos) {
      let contador = 0;
      for (const item of listadeBrinquedosObtidos) {
        if (item === listaBrinquedoNecessarios[contador]) contador++;
        if (contador === listaBrinquedoNecessarios.length) return true;
      }
      return false;
    }

    // Regra do loco de conter todos ignorando a sequencia
    const contemTodos = (listaBrinquedoNecessarios, listadeBrinquedosObtidos) => listaBrinquedoNecessarios.every(t => listadeBrinquedosObtidos.includes(t));

    
    const resultados = [];
    let qtd1 = 0, qtd2 = 0;
    const usadosGatos = { 1: new Set(), 2: new Set() }; // gatos não dividem brinquedos 

    for (const animal of animais) {
      const { tipo, brinquedos: fav } = registroAnimais[animal];

      const pessoa1OrdemCerta = (animal === 'Loco' && qtd1 > 0)
        ? contemTodos(fav, brinquedosDaPessoa1)
        : ordemDesejada(fav, brinquedosDaPessoa1);

      const pessoa2OrdemCerta = (animal === 'Loco' && qtd2 > 0)
        ? contemTodos(fav, brinquedosDaPessoa2)
        : ordemDesejada(fav, brinquedosDaPessoa2);

      const pessoa1GatoOk = tipo !== 'gato' || fav.every(t => !usadosGatos[1].has(t));
      const pessoa2GatoOk = tipo !== 'gato' || fav.every(t => !usadosGatos[2].has(t));

      const pessoa1DentroLimite = qtd1 < 3;
      const pessoa2DentroLimite = qtd2 < 3;

      const pessoa1Ok = pessoa1DentroLimite && pessoa1OrdemCerta && pessoa1GatoOk;
      const pessoa2Ok = pessoa2DentroLimite && pessoa2OrdemCerta && pessoa2GatoOk;

      let destino = 'abrigo';

      if (pessoa1Ok && pessoa2Ok) {
        destino = 'abrigo'; // volta pro abrigo(empate, tadinhos)
      } else if (pessoa1Ok) {
        destino = 'pessoa 1';
        qtd1++;
        if (tipo === 'gato') fav.forEach(t => usadosGatos[1].add(t));
      } else if (pessoa2Ok) {
        destino = 'pessoa 2';
        qtd2++;
        if (tipo === 'gato') fav.forEach(t => usadosGatos[2].add(t));
      }

      resultados.push(`${animal} - ${destino}`);
    }

    return { lista: resultados, erro: false };
  }
}

export default AbrigoAnimais;