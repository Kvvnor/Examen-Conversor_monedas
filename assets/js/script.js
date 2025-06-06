const formDivisas = document.querySelector('#formDivisas');
const resultadoDivisa = document.querySelector('.Divisa');

const montoInput = document.querySelector('#monto');
const moneda = document.querySelector('#moneda');

formDivisas.addEventListener('submit', async (event) => {
    event.preventDefault();
    const monto = parseFloat( montoInput.value );
    const divisa = moneda.value;
    const dataDivisa = await fetchDivisas(divisa);

    if ( dataDivisa === null ) {
        alert('No se pudieron obtener los datos de la divisa seleccionada.');
        return;
    }

    const dataDivisaParseado = parseCurrencyObject( dataDivisa );
    const ValorCLP = MontoCLP( monto, dataDivisa[0].valor );
    resultadoDivisa.innerHTML = ValorCLP;

    await graficoDivisas( dataDivisaParseado );


});


async function fetchDivisas(divisa) {
    try {

        const response = await fetch(`https://mindicador.cl/api/${divisa}`);
        const data = await response.json();
        return data?.serie || null;
        
    } catch (error) {
        alert('Error al obtener los datos de la divisa: ' + error);
        console.log('Error desde el servidor: ' + error);
    }
}


function MontoCLP(monto, valorDivisa) {
    return valorDivisa == 0
        ? 0
        : (monto / valorDivisa).toFixed(2) ;
}

function parseCurrencyObject(dataDivisa) {
    return dataDivisa.slice(0, 10).map( currency => ({
        fecha: new Date(currency.fecha).toISOString().split('T')[0],
        valor: currency.valor.toFixed(2)
    }));
}

