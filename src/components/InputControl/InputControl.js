import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather";

import styles from "./InputControl.module.css";

function InputControl({ Label, isPassword, ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.container}>
      {Label && <label>{Label}</label>}
      <div className={styles.inputContainer}>
        <input
          type={isPassword ? (isVisible ? "text" : "password") : "text"}
          {...props}
        />
        {isPassword && (
          <div className={styles.icon}>
            {isVisible ? (
              <EyeOff onClick={() => setIsVisible((prev) => !prev)} />
            ) : (
              <Eye onClick={() => setIsVisible((prev) => !prev)} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputControl;
