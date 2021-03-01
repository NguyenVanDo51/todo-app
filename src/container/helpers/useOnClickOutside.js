/* eslint-disable*/

import React, { useEffect } from 'react';
// Hook
export function useOnClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            // Không làm gì nếu click vào element hoặc con cháu của nó
            // event.target có thể là con cháu của ref.current, nên cần check điều kiện 2
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            // Nếu click ngoài ref thì thực hiện handle
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
