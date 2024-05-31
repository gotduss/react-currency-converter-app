/* Import */
import { useState, useEffect } from 'react';
import { API_KEY } from "../Data";
import Freecurrencyapi from "@everapi/freecurrencyapi-js";
import CurrencySelector from '../CurrencySelector';

const CurrencyConverter = () => {
  const freecurrencyapi = new Freecurrencyapi(API_KEY);
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await freecurrencyapi.currencies();
        console.log(Object.values(response.data));
        setCurrencies(Object.values(response.data));
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    try {
      const response = await freecurrencyapi.latest({
        base_currency: fromCurrency,
        currencies: toCurrency,
      });
      const rate = response.data[toCurrency];
      setConversionRate(rate);
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };

  return (
    <div className="CurrencyConverter">
      <h1>Currency converter</h1>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            From:
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={fromCurrency}
              onCurrencyChange={setFromCurrency}
            />
          </label>
        </div>
        <div>
          <label>
            To:
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={toCurrency}
              onCurrencyChange={setToCurrency}
            />
          </label>
        </div>
        <button type="button" onClick={handleConvert}>
          Convert
        </button>
      </form>
      {convertedAmount && (
        <div>
          <h2>
            {amount} {fromCurrency} is equal to {convertedAmount} {toCurrency}
          </h2>
          <p>Conversion Rate: 1 {fromCurrency} = {conversionRate} {toCurrency}</p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
