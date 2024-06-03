/* Import */
import { useState, useEffect } from 'react';
import { API_KEY } from "../Data";
import Freecurrencyapi from "@everapi/freecurrencyapi-js";
import CurrencySelector from '../CurrencySelector';
import './index.css';

const CurrencyConverter = () => {
  const freecurrencyapi = new Freecurrencyapi(API_KEY);
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [resultFromCurrency, setResultFromCurrency] = useState('USD');
  const [resultToCurrency, setResultToCurrency] = useState('EUR');
  const [currencySymbols, setCurrencySymbols] = useState({ USD: { symbol: '$' } });
  
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await freecurrencyapi.currencies();
        console.log(Object.values(response.data));
        setCurrencies(Object.values(response.data));
        setCurrencySymbols(response.data);
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
      setResultFromCurrency(fromCurrency);
      setResultToCurrency(toCurrency);
    } catch (error) {
      console.error('Error converting currency:', error);
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    return currencySymbols[currencyCode]?.symbol || '';
  };

  return (
    <div className="CurrencyConverter">
      <h1>Currency converter</h1>
      <form onSubmit={e => e.preventDefault()}>
        <div className="formGroup">
          <label>
            Amount:
            <div className="currencyFormGroup">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <span>{getCurrencySymbol(fromCurrency)}</span>
            </div>
          </label>
        </div>
        <div className="formGroup">
          <label>
            From:
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={fromCurrency}
              onCurrencyChange={setFromCurrency}
            />
          </label>
        </div>
        <div className="formGroup">
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
        <div className="result">
          <h2>
            {amount} {resultFromCurrency} is equal to {convertedAmount} {resultToCurrency}
          </h2>
          <p>Conversion Rate: 1 {resultFromCurrency} = {conversionRate} {resultToCurrency}</p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
