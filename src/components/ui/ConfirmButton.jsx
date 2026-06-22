import "./ConfirmButton.css";

import React, { useState } from "react";

import { Button } from "@thatmuch/designsystem";
import { Trash2 } from "lucide-react";

const ConfirmButton = ({
  onConfirm,
  icon,
  label,
  message = "Confirmer ?",
  size = 18,
  variant = "white",
  confirmVariant = "com",
}) => {
  const [status, setStatus] = useState("idle");
  const confirming = status === "confirming";

  const handleClick = (e) => {
    e.stopPropagation();
    if (confirming) {
      onConfirm();
      setStatus("idle");
    } else {
      setStatus("confirming");
    }
  };

  return (
    <Button
      type="button"
      variant={confirming ? confirmVariant : variant}
      size="sm"
      iconOnly={!confirming}
      className="confirm-btn"
      onClick={handleClick}
      onBlur={() => setStatus("idle")}
      aria-label={confirming ? message : label}
      title={confirming ? message : label}
      icon={icon ? icon : <Trash2 size={size} />}
    >
      {confirming ? message : ""}
    </Button>
  );
};

export default ConfirmButton;
