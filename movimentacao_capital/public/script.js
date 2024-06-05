document.addEventListener('DOMContentLoaded', () => {
  const consultaForm = document.getElementById('consultaForm');
  const tabelaResultado = document.getElementById('tabelaResultado');

  consultaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const nrMatricula = document.getElementById('nr_matricula').value;
    const dataInicio = document.getElementById('data_inicio').value;
    const dataFim = document.getElementById('data_fim').value;

    try {
      const response = await fetch('/buscar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nr_matricula=${nrMatricula}&data_inicio=${dataInicio}&data_fim=${dataFim}`
      });
      if (response.ok) {
        const data = await response.json();
        exibirTabelaResultado(data);
      } else {
        console.error('Erro ao buscar dados:', response.statusText);
      }
    } catch (error) {
      console.error('Erro de rede:', error);
    }
  });

  function exibirTabelaResultado(data) {
    tabelaResultado.innerHTML = '';

    if (data.length > 0) {
      const table = document.createElement('table');
      const headers = Object.keys(data[0]);

      // Criação do cabeçalho da tabela
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Preenchimento da tabela com os dados
      const tbody = document.createElement('tbody');
      data.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(header => {
          const cell = document.createElement('td');
          const cellValue = rowData[header];

          // Verificar se o valor é um número negativo
          if (isNegative(cellValue)) {
            cell.style.color = 'red'; // Aplicar cor vermelha para valores negativos
          }

          cell.textContent = cellValue;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);

      tabelaResultado.appendChild(table);
    } else {
      tabelaResultado.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    }
  }

  function isNegative(value) {
    // Remove caracteres não numéricos (exceto ponto e hífen)
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return !isNaN(numericValue) && numericValue < 0;
  }
});
