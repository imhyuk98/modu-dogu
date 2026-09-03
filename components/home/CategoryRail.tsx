"use client";

import { useId, useRef } from "react";
import type { KeyboardEvent } from "react";

export interface CategoryTab {
  key: string;
  label: string;
  count: number;
}

interface CategoryRailProps {
  items: CategoryTab[];
  value: string;
  onValueChange: (value: string) => void;
  controlsId: string;
}

// Roving-focus keyboard behavior adapted from the 21st.dev accessible Tabs pattern.
export default function CategoryRail({
  items,
  value,
  onValueChange,
  controlsId,
}: CategoryRailProps) {
  const baseId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const focusAndSelect = (index: number) => {
    const next = items[index];
    if (!next) return;
    buttons.current[index]?.focus();
    onValueChange(next.key);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    focusAndSelect(nextIndex);
  };

  return (
    <div
      className="home-category-rail"
      role="tablist"
      aria-label="도구 카테고리"
    >
      {items.map((item, index) => {
        const selected = item.key === value;
        return (
          <button
            key={item.key}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`${baseId}-${item.key}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={controlsId}
            tabIndex={selected ? 0 : -1}
            className="home-category-tab"
            onClick={() => onValueChange(item.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span>{item.label}</span>
            <span className="home-category-count">{item.count}</span>
          </button>
        );
      })}
    </div>
  );
}
