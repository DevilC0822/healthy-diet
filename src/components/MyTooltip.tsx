/* eslint-disable react-hooks/exhaustive-deps */
import {
  Tooltip as TooltipUI,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { cn } from "@heroui/react";
import { useRef, useEffect, useState } from "react";

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  maxWidth?: string;
  textEllipsis?: boolean;
  lineClamp?: number;
}


const MyTooltip = (props: TooltipProps) => {
  const { content, children, maxWidth = 360, textEllipsis, lineClamp = 1 } = props;
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // 检测文本是否被截断
  const checkTextTruncation = () => {
    const element = textRef.current;
    if (!element || !textEllipsis) {
      setIsTextTruncated(false);
      return;
    }

    // 对于多行文本，比较scrollHeight和clientHeight
    if (lineClamp > 1) {
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setIsTextTruncated(isOverflowing);
    } else {
      // 对于单行文本，使用更可靠的方法检测
      const range = document.createRange();
      range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      const isOverflowing = rect.width > element.clientWidth;
      setIsTextTruncated(isOverflowing);
    }
  };

  useEffect(() => {
    // 初始检测
    setTimeout(checkTextTruncation, 100);

    // 使用ResizeObserver监听元素尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkTextTruncation, 0);
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, textEllipsis, lineClamp]);

  // 如果不需要省略或文本未被截断，直接渲染内容
  if (!textEllipsis || !isTextTruncated) {
    return <p className={cn(textEllipsis && `line-clamp-${lineClamp}`)} ref={textRef}>{children}</p>;
  }

  return (
    <>
      <div className={cn("block max-md:hidden")}>
        <TooltipUI content={
          <div style={{ width: `${maxWidth}px` }}>
            {content}
          </div>
        }>
          <p className={cn(textEllipsis && `line-clamp-${lineClamp}`)} ref={textRef}>{children}</p>
        </TooltipUI>
      </div>
      <div className="hidden max-md:block">
        <Popover backdrop="blur">
          <PopoverTrigger>
            <p className={cn(textEllipsis && `line-clamp-${lineClamp}`)} ref={textRef}>{children}</p>
          </PopoverTrigger>
          <PopoverContent>
            <div style={{ width: `${maxWidth}px` }}>
              {content}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default MyTooltip;