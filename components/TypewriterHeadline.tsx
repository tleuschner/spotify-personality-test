import React, { useCallback, useEffect, useRef } from "react";
import TypewriterComponent, { TypewriterState } from "typewriter-effect";

interface TypewriterHeadlineProps {
  text: string;
  onReady?: (state: TypewriterState) => void;
}

const TypewriterHeadline: React.FC<TypewriterHeadlineProps> = ({
  text,
  onReady = () => null,
}) => {
  return (
    <TypewriterComponent
      onInit={(typewriter) => {
        typewriter
          .typeString(text)
          .start()
          .callFunction((state) => onReady(state));
      }}
      options={{
        autoStart: true,
      }}
    />
  );
};

export default TypewriterHeadline;
