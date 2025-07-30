import { useEffect, useState } from 'react';

export function useExchangeRate(base = 'JPY', target = 'KRW') {
  const [rate, setRate] = useState<number|null>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setRate(data.rates[target]))
      .catch(err => setError(err.message));
  }, [base, target]);

  return { rate, error };
}