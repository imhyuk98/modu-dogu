"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/lib/sections";

interface ToolSearchProps {
  items: Item[];
  query: string;
  onQueryChange: (query: string) => void;
}

export default function ToolSearch({
  items,
  query,
  onQueryChange,
}: ToolSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("ko");
    if (!needle) return [];
    return items
      .filter((item) =>
        `${item.title} ${item.desc}`.toLocaleLowerCase("ko").includes(needle),
      )
      .slice(0, 7);
  }, [items, query]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key.toLocaleLowerCase() !== "k" || (!event.ctrlKey && !event.metaKey)) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };

    document.addEventListener("keydown", focusSearch);
    return () => document.removeEventListener("keydown", focusSearch);
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!open || matches.length === 0) {
      if (event.key === "Escape") inputRef.current?.blur();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) => (index + 1) % matches.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => (index - 1 + matches.length) % matches.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      router.push(matches[selectedIndex].href);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      className="home-search-wrap"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <label className="home-search-label" htmlFor="home-tool-search">
        뭐 할지 검색
      </label>
      <div className="home-search-field">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
        </svg>
        <input
          ref={inputRef}
          id="home-tool-search"
          type="search"
          value={query}
          placeholder="뭐 하지? 운세, 케미, 연봉 계산…"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && query.trim().length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[selectedIndex] ? `${listId}-${selectedIndex}` : undefined
          }
          onFocus={() => setOpen(query.trim().length > 0)}
          onChange={(event) => {
            setSelectedIndex(0);
            setOpen(event.target.value.trim().length > 0);
            onQueryChange(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="home-search-clear"
            aria-label="검색어 지우기"
            onClick={() => {
              onQueryChange("");
              setOpen(false);
              setSelectedIndex(0);
              inputRef.current?.focus();
            }}
          >
            지우기
          </button>
        ) : (
          <kbd className="home-search-key">Ctrl K</kbd>
        )}
      </div>

      {open && query.trim().length > 0 && (
        <div className="home-search-results" id={listId} role="listbox">
          {matches.length > 0 ? (
            matches.map((item, index) => (
              <Link
                key={item.href}
                id={`${listId}-${index}`}
                href={item.href}
                role="option"
                aria-selected={selectedIndex === index}
                className="home-search-result"
                onMouseEnter={() => setSelectedIndex(index)}
                onFocus={() => setSelectedIndex(index)}
                onClick={() => setOpen(false)}
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            ))
          ) : (
            <p className="home-search-empty">그건 아직 없음. 다른 검색어는 어때?</p>
          )}
        </div>
      )}
    </div>
  );
}
