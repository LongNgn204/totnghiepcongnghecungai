import React from 'react';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ items, value, defaultValue, onChange, className = '' }) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string>(defaultValue || items[0]?.key);
  const activeKey = isControlled ? (value as string) : internal;

  const setActive = (key: string) => {
    if (items.find((i) => i.key === key)?.disabled) return;
    if (!isControlled) setInternal(key);
    onChange?.(key);
  };

  return (
    <div className={`w-full ${className}`}>
      <div role="tablist" aria-label="Tabs" className="flex items-center gap-2 border-b border-border">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={active}
              aria-controls={`tab-panel-${item.key}`}
              disabled={item.disabled}
              onClick={() => setActive(item.key)}
              className={`px-3 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors ${
                active
                  ? 'border-primary-600 text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-neutral-300'
              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        {items.map((item) => (
          <div
            key={item.key}
            id={`tab-panel-${item.key}`}
            role="tabpanel"
            hidden={item.key !== activeKey}
            className="focus:outline-none"
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;


