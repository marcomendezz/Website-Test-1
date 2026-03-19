"use client";
import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "../../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  textClassName = "",
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-10% 0px" });
  let wordsArray = words.split(" ");
  
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ? duration : 1.2,
          delay: stagger(0.25),
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          // Add custom logic to parse asterisks as accent/italic text
          const isAccent = word.startsWith('*') && word.endsWith('*');
          const cleanWord = word.replace(/\*/g, '');
          
          // Render newline if the word is exactly <br/>
          if (cleanWord === "<br/>" || cleanWord === "<br/>,") {
             return <br key={word + idx} />;
          }

          return (
            <motion.span
              key={word + idx}
              className={cn("opacity-0", textClassName, isAccent ? "text-accent italic" : "")}
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {cleanWord}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn(className)}>
      <div className={cn("leading-[1.1] tracking-wide", className)}>
        {renderWords()}
      </div>
    </div>
  );
};
