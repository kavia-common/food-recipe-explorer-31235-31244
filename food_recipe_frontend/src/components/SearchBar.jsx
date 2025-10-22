import { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, loading }) {
  /** SearchBar controls recipe query */
  const [text, setText] = useState(value || '');

  useEffect(() => setText(value || ''), [value]);

  const submit = (e) => {
    e.preventDefault();
    onChange?.(text);
  };

  return (
    <form className="search-bar" onSubmit={submit} role="search" aria-label="Search recipes">
      <input
        aria-label="Search recipes"
        placeholder="Search recipes or tags e.g. pasta, vegan"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn" type="submit" aria-label="Search">
        {loading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
