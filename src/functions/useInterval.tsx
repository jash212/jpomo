import { useRef, useEffect } from 'react';

interface CallbackTemplate {
  current: Function;
}

export default function useInterval(callback: Function, delay: number | null) {
    var savedCallback = useRef() as CallbackTemplate;   
    
    useEffect(() => {
       savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
};