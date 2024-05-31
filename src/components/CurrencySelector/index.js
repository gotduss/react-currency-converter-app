/* Import */

const CurrencySelector = ({
  currencies,
  selectedCurrency,
  onCurrencyChange
}) => {
  return (
    <select value={selectedCurrency} onChange={e => onCurrencyChange(e.target.value)}>
      {currencies.map(currency => (
        <option key={currency.code} value={currency.code}>
          {currency.code} - {currency.name}
        </option>
      ))}
    </select>
  );
};

export default CurrencySelector;
