// eslint-disable
import React, { useState, useEffect } from 'react';

const EditableText = ({
    name,
    type,
    value,
    input_class,
    onChange,
    onFocus,
    handleEnter,
    onKeyUp,
    text_class,
    disabled,
}) => {
    const [value_t, set_value_t] = useState(value);
    const [edit, set_edit] = useState(false);
    const [backup, set_backup] = useState('');

    useEffect(() => {
        set_value_t(value);
    }, [value]);

    const handle_on_focus = (e) => {
        const value_input = e.target.value;
        e.target.value = '';
        e.target.value = value_input;
        set_backup(value);
    };

    const handle_key_up = (e) => {
        if (e.key === 'Escape') {
            set_edit(false);
            if (onChange) {
                onChange({ target: { value: backup } });
            } else {
                set_value_t(backup);
            }
        }
        if (e.keyCode === 13) {
            set_edit(false);
            handleEnter();
        }
    };

    return (
        <>
            {edit === true && !disabled ? (
                <input
                    name={name}
                    type={type}
                    value={value}
                    disabled={disabled}
                    className={input_class || ''}
                    autoFocus
                    onFocus={onFocus || handle_on_focus}
                    onChange={onChange || ((e) => set_value_t(e.target.value))}
                    // onBlur={onBlur || (() => set_edit(false))}
                    onKeyUp={onKeyUp || handle_key_up}
                />
            ) : (
                <span className={text_class} onClick={() => set_edit(true)}>
                    {value_t}
                </span>
            )}
        </>
    );
};

export default EditableText;
