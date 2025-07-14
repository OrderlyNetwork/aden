import { useEffect, useState } from 'react';

export default function PriceDisplay() {
  const [price, setPrice] = useState('0.002382');
  const [change, setChange] = useState('+0.00');
  const [changePercent, setChangePercent] = useState('(+3.66%)');
  const [priceColor, setPriceColor] = useState('text-[#22c55e]');

  useEffect(() => {
    const updatePriceData = () => {
      const priceElement = document.getElementById('bgsc-price');
      const changeElement = document.getElementById('bgsc-change');
      const changePercentElement = document.getElementById('bgsc-change-percent');

      if (priceElement && changeElement && changePercentElement) {
        setPrice(priceElement.textContent || '0.002382');
        setChange(changeElement.textContent || '+0.00');
        setChangePercent(`(${changePercentElement.textContent || '+3.66%'})`);
        
        // Set color based on price change
        if ((changeElement.textContent || '').startsWith('+')) {
          setPriceColor('dc-text-[#22c55e]');
        } else if ((changeElement.textContent || '').startsWith('-')) {
          setPriceColor('dc-text-red-500');
        } else {
          setPriceColor('dc-text-white');
        }
      }
    };

    // Initial update
    updatePriceData();

    // Set up interval for real-time updates
    const intervalId = setInterval(updatePriceData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dc-flex dc-items-baseline dc-mt-2">
      <span className="dc-text-5xl dc-font-bold dc-text-white">{price}</span>
      <span className={`dc-ml-2 dc-text-lg ${priceColor}`}>{change} {changePercent}</span>
    </div>
  );
} 